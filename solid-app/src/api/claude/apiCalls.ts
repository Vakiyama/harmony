import { z } from 'zod';
import { EOL } from 'os';
type ZodObjectAny = z.ZodObject<any, any, any, any>;
import { mightFail, mightFailSync } from '../../libs/might-fail/index';

export const defaultClaudeSettings = {
  model: 'claude-3-5-sonnet-20240620',
  maxTokens: 1000,
};

type Role = 'user' | 'assistant';

type TextContent = {
  type: 'text';
  text: string;
};

export type Message = {
  readonly role: Role;
  readonly content: string;
};

type UserMessage = {
  readonly role: 'user';
} & Message;

type AssistantMessage = {
  readonly role: 'assistant';
} & Message;

// enforces the constraint: there must never be two assistant messages in a row.
export type ValidMessages<
  T extends readonly Message[],
  PrevRole extends Role | null = null,
> = T extends []
  ? T
  : T extends [infer Head extends Message, ...infer Tail extends Message[]]
  ? Head extends Message
  ? PrevRole extends 'assistant'
  ? Head['role'] extends 'assistant'
  ? never // Invalid if two assistants are consecutive
  : [Head, ...ValidMessages<Tail, Head['role']>]
  : [Head, ...ValidMessages<Tail, Head['role']>]
  : never
  : never;

type AssistantResponse = {
  content: TextContent[];
  id: string;
  model: string;
  role: 'assistant';
  stop_reason: string;
  stop_sequence: null;
  type: 'message';
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

type ClaudeCallParamsWithoutFormat<T extends readonly Message[]> = {
  claudeSettings: ClaudeSettings;
  system: string;
  messages: T & ValidMessages<T>;
  jsonFormat?: undefined;
  jsonFormatError?: [AssistantMessage, UserMessage];
};

type ClaudeCallParamsWithFormat<
  T extends readonly Message[],
  F extends ZodObjectAny,
> = {
  claudeSettings: ClaudeSettings;
  system: string;
  messages: T & ValidMessages<T>;
  jsonFormat: ClaudeFormatParams<F>;
  jsonFormatError?: [AssistantMessage, UserMessage];
};

// overloads

export async function callClaude<T extends readonly Message[]>(
  params: ClaudeCallParamsWithoutFormat<T>
): Promise<AssistantResponse>;

export async function callClaude<
  T extends readonly Message[],
  F extends ZodObjectAny,
>(params: ClaudeCallParamsWithFormat<T, F>): Promise<z.output<F>>;

/**
 * Call Anthropic Claude API
 * @param params - parameters for the API call
 */
export async function callClaude<
  T extends readonly Message[],
  F extends ZodObjectAny,
>(
  params: ClaudeCallParamsWithoutFormat<T> | ClaudeCallParamsWithFormat<T, F>
): Promise<AssistantResponse | z.output<F>> {
  if (params.jsonFormat?.retryLimit === 0) {
    throw new Error('Retry limit hit for formatted claude response attempts');
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

  const stringifiedBody = JSON.stringify(body);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: stringifiedBody,
  });

  const claudeApiCall = (await response.json()) as AssistantResponse;

  console.log('Claude API call:');
  console.log(claudeApiCall);

  if (params.jsonFormat === undefined) {
    return claudeApiCall;
  }

  const [jsonParseError, jsonParseResult] = mightFailSync(() =>
    JSON.parse(claudeApiCall.content[0].text)
  );

  if (jsonParseError) {
    return handleClaudeRetry(params, claudeApiCall, {
      type: 'parse',
      error: jsonParseError,
    });
  }

  const [zodValidateError, zodValidateResult] = await mightFail(
    params.jsonFormat!.format.parseAsync(jsonParseResult)
  );

  if (zodValidateError)
    return handleClaudeRetry(params, claudeApiCall, {
      type: 'validate',
      error: zodValidateError,
    });

  return zodValidateResult as z.output<F>;
}

async function handleClaudeRetry<
  T extends readonly Message[],
  F extends ZodObjectAny,
>(
  params: ClaudeCallParamsWithFormat<T, F>,
  claudeApiCall: AssistantResponse,
  errorDetails: { type: 'validate' | 'parse'; error: Error }
) {
  if (!params.jsonFormat) throw new Error('Retry without JSON format?');

  params.jsonFormatError = [
    { role: 'assistant', content: claudeApiCall.content[0].text },
    {
      role: 'user',
      content: `Your response gave the following ${errorDetails.type === 'parse' ? 'JSON parse' : 'Zod validation'} error:
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
  return `
    ## Response Format
    To answer, you've been given the following response format:

    Please respond with only the object format as a JSON parsable string.
    Don't give any reasoning or explanations.

    Descriptions of fields:

    ## Format
    ${schemaToString(format)}
    `;
}

function schemaToString(schema: ZodObjectAny): string {
  const shape = schema.shape;
  const fields = Object.keys(shape)
    .map(
      (key) =>
        `${key}: ${shape[key].toString()}, // ${schema.shape[key].description}`
    )
    .join(EOL);

  return `{ ${fields} }`;
}
