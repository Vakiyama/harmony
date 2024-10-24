import { ZodTypeAny, z } from "zod";
export type ZodObjectAny = z.ZodObject<any, any, any, any>;
import { mightFail, mightFailSync } from "might-fail";

export const defaultClaudeSettings = {
  model: "claude-3-5-sonnet-20240620",
  maxTokens: 1000,
};

type Role = "user" | "assistant";

type TextContent = {
  type: "text";
  text: string;
};

export type Message = {
  readonly role: Role;
  readonly content: string;
};

type UserMessage = {
  readonly role: "user";
} & Message;

type AssistantMessage = {
  readonly role: "assistant";
} & Message;

type AssistantResponse = {
  content: TextContent[];
  id: string;
  model: string;
  role: "assistant";
  stop_reason: string;
  stop_sequence: null;
  type: "message";
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
};

type ClaudeSettings = {
  model: string;
  maxTokens: number;
};

type ClaudeFormatParams<F extends ZodObjectAny> = {
  format: F;
  retryLimit: number;
};

type ClaudeCallParamsWithoutFormat = {
  claudeSettings: ClaudeSettings;
  system: string;
  messages: Message[];
  jsonFormat?: undefined;
  jsonFormatError?: [AssistantMessage, UserMessage];
};

type ClaudeCallParamsWithFormat<F extends ZodObjectAny> = {
  claudeSettings: ClaudeSettings;
  system: string;
  messages: Message[];
  jsonFormat: ClaudeFormatParams<F>;
  jsonFormatError?: [AssistantMessage, UserMessage];
};

// overloads

export async function callClaude(
  params: ClaudeCallParamsWithoutFormat,
): Promise<AssistantResponse>;

export async function callClaude<F extends ZodObjectAny>(
  params: ClaudeCallParamsWithFormat<F>,
): Promise<z.output<F>>;

/**
 * Call Anthropic Claude API
 * @param params - parameters for the API call
 */
export async function callClaude<F extends ZodObjectAny>(
  params: ClaudeCallParamsWithoutFormat | ClaudeCallParamsWithFormat<F>,
): Promise<AssistantResponse | z.output<F>> {
  if (params.jsonFormat?.retryLimit === 0) {
    throw new Error("Retry limit hit for formatted claude response attempts");
  }

  if (params.jsonFormatError) params.messages.concat(params.jsonFormatError);

  const body = {
    model: params.claudeSettings.model,
    max_tokens: params.claudeSettings.maxTokens,
    messages: params.messages,
    system: params.jsonFormat
      ? `
    ${params.system}
    ${getResponsePrompt(params.jsonFormat.format)}
        `
      : params.system,
  };

  console.log("Calling claude with the following system message:");
  console.log(body.system);
  console.log("Calling claude with the following messages:");
  console.log(JSON.stringify(body.messages));

  const stringifiedBody = JSON.stringify(body);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: stringifiedBody,
  });

  const claudeApiCall = (await response.json()) as AssistantResponse;

  console.log("Claude API call:");
  console.log(claudeApiCall);

  if (params.jsonFormat === undefined) {
    return claudeApiCall;
  }

  const [jsonParseError, jsonParseResult] = mightFailSync(() =>
    JSON.parse(claudeApiCall.content[0].text),
  );

  if (jsonParseError) {
    return handleClaudeRetry(params, claudeApiCall, {
      type: "parse",
      error: jsonParseError,
    });
  }

  const [zodValidateError, zodValidateResult] = await mightFail(
    params.jsonFormat!.format.parseAsync(jsonParseResult),
  );

  if (zodValidateError)
    return handleClaudeRetry(params, claudeApiCall, {
      type: "validate",
      error: zodValidateError,
    });

  return zodValidateResult as z.output<F>;
}

async function handleClaudeRetry<F extends ZodObjectAny>(
  params: ClaudeCallParamsWithFormat<F>,
  claudeApiCall: AssistantResponse,
  errorDetails: { type: "validate" | "parse"; error: Error },
) {
  if (!params.jsonFormat) throw new Error("Retry without JSON format?");

  params.jsonFormatError = [
    { role: "assistant", content: claudeApiCall.content[0].text },
    {
      role: "user",
      content: `Your response gave the following ${errorDetails.type === "parse" ? "JSON parse" : "Zod validation"} error:
          \`\`\`
          ${errorDetails.error.message}
          \`\`\`

          Please correct your mistakes and try again.
          `,
    },
  ];

  params.jsonFormat = {
    ...params.jsonFormat,
    retryLimit: params.jsonFormat!.retryLimit - 1,
  };

  return await callClaude(params);
}

// we'd like an API for getting json responses from claude
// We'll use zod and pass in a "response schema"

function getResponsePrompt(format: ZodObjectAny): string {
  const prompt = `
    ## Response Format
    To answer, you've been given the following response format:

    Please respond with only the object format as a JSON parsable string.
    Don't give any reasoning or explanations.


    ${format.description ? `Description of object: ${format.description}` : ""}
    Descriptions of fields:

    ## Format
    ${schemaToString(format)}
    `;

  return prompt;
}

function schemaToString(schema: ZodTypeAny): string {
  const typeName = schema._def.typeName;

  // Get the description if available
  const description = schema.description ? ` // ${schema.description}` : "";

  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return `string${description}`;
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return `number${description}`;
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return `boolean${description}`;
    case z.ZodFirstPartyTypeKind.ZodLiteral:
      return `${JSON.stringify(schema._def.value)}${description}`;
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return `${schema._def.values.map((v: any) => JSON.stringify(v)).join(" | ")}${description}`;
    case z.ZodFirstPartyTypeKind.ZodUnion:
      return `(${schema._def.options.map(schemaToString).join(" | ")})${description}`;
    case z.ZodFirstPartyTypeKind.ZodArray:
      return `Array<${schemaToString(schema._def.type)}>${description}`;
    case z.ZodFirstPartyTypeKind.ZodObject:
      const shape = schema._def.shape();
      const fields = Object.keys(shape)
        .map((key) => `${key}: ${schemaToString(shape[key])}`)
        .join(",\n");
      return `{\n${fields}\n}${description}`;
    case z.ZodFirstPartyTypeKind.ZodOptional:
      return `${schemaToString(schema._def.innerType)} | undefined${description}`;
    case z.ZodFirstPartyTypeKind.ZodNullable:
      return `${schemaToString(schema._def.innerType)} | null${description}`;
    case z.ZodFirstPartyTypeKind.ZodDefault:
      return `${schemaToString(schema._def.innerType)} // default: ${JSON.stringify(schema._def.defaultValue())}${description}`;
    case z.ZodFirstPartyTypeKind.ZodAny:
      return `any${description}`;
    case z.ZodFirstPartyTypeKind.ZodUnknown:
      return `unknown${description}`;
    case z.ZodFirstPartyTypeKind.ZodVoid:
      return `void${description}`;
    case z.ZodFirstPartyTypeKind.ZodNever:
      return `never${description}`;
    case z.ZodFirstPartyTypeKind.ZodTuple:
      const items = schema._def.items.map(schemaToString).join(", ");
      return `[${items}]${description}`;
    case z.ZodFirstPartyTypeKind.ZodRecord:
      return `{ [key: string]: ${schemaToString(schema._def.valueType)} }${description}`;
    case z.ZodFirstPartyTypeKind.ZodMap:
      return `Map<${schemaToString(schema._def.keyType)}, ${schemaToString(schema._def.valueType)}>${description}`;
    case z.ZodFirstPartyTypeKind.ZodSet:
      return `Set<${schemaToString(schema._def.valueType)}>${description}`;
    case z.ZodFirstPartyTypeKind.ZodDate:
      return `Date${description}`;
    case z.ZodFirstPartyTypeKind.ZodFunction:
      const args = schema._def.args.items.map(schemaToString).join(", ");
      const returns = schemaToString(schema._def.returns);
      return `(${args}) => ${returns}${description}`;
    case z.ZodFirstPartyTypeKind.ZodLazy:
      return `Lazy<${schemaToString(schema._def.getter())}>${description}`;
    case z.ZodFirstPartyTypeKind.ZodPromise:
      return `Promise<${schemaToString(schema._def.type)}>${description}`;
    case z.ZodFirstPartyTypeKind.ZodEffects:
      return schemaToString(schema._def.schema); // Simplify by showing the base schema
    case z.ZodFirstPartyTypeKind.ZodBranded:
      return schemaToString(schema._def.type); // Simplify by showing the base schema
    case z.ZodFirstPartyTypeKind.ZodNativeEnum:
      return `Enum${description}`; // Could be expanded if needed
    default:
      return `UnknownType${description}`;
  }
}
