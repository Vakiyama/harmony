import { z, ZodObject } from 'zod';
import { mightFailSync } from 'might-fail/go';

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

/**
 * Call Anthropic Claude API
 * @param claudeSettings - settings for the model, check types
 * @param system - system prompt for claude to follow. Determines behavior.
 * @param messages - must be called passed as const; for example: [{ role: "user", content: "example"} as const]
 */
export async function callClaude<
  T extends readonly Message[],
  F extends ZodObject<any>,
>(
  claudeSettings: {
    model: string;
    maxTokens: number;
  } = defaultClaudeSettings,
  system: string,
  messages: T & ValidMessages<T>,
  jsonFormat?: { format: F, retryLimit: number },
): Promise<F extends ZodObject<any> ? z.infer<F> : AssistantResponse> {
  const body = {
    model: claudeSettings.model,
    max_tokens: claudeSettings.maxTokens,
    messages,
    system: jsonFormat
      ? `
    ${system}
    ${getResponsePrompt(jsonFormat.format)}
        `
      : system,
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

  const json = (await response.json()) as unknown as AssistantResponse;

  console.log('Claude API call:');
  console.log(json);
  if (!format) return json;
  else {
    const [result, error] = mightFailSync(() =>
      JSON.parse(json.content[0].text)
    );

    if (error) 
  }
}

// we'd like an API for getting json responses from claude
// We'll use zod and pass in a "response schema"

function getResponsePrompt(format: ZodObject<any>): string {
  return `
    ## Response Format
    To answer, you've been given the following response format:

    Please respond with only the object format as a JSON parsable string.
    Don't give any reasoning or explanations.

    ${schemaToString(format)}
    `;
}

function schemaToString(schema: ZodObject<any>): string {
  const shape = schema.shape;
  const fields = Object.keys(shape)
    .map((key) => `${key}: ${shape[key].toString()}`)
    .join(', ');

  return `{ ${fields} }`;
}
