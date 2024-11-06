import {
  type JsonSchema7ObjectType,
  zodToJsonSchema,
} from 'zod-to-json-schema';
import { type ZodObjectAny } from './callClaude';
import { Effect, pipe } from 'effect';

export type Tool<N extends string = string> = {
  name: N;
  description: string;
  input_schema: JsonSchema7ObjectType;
};

type ToolParams<F extends ZodObjectAny, S extends string> = {
  schema: F;
  description: string;
  name: NoSpaces<S>;
};

type InvalidToolNameError = {
  readonly _tag: 'invalidNameDescription';
};

const InvalidToolNameError = (): InvalidToolNameError => ({
  _tag: 'invalidNameDescription',
});

type NoSpaces<T extends string> = T extends `${infer _} ${infer _}` ? never : T;

function validateTool<F extends ZodObjectAny, S extends string>(
  toolParams: ToolParams<F, S>
): Effect.Effect<ToolParams<F, S>, InvalidToolNameError> {
  return toolParams.name.includes(' ')
    ? Effect.fail(InvalidToolNameError())
    : Effect.succeed(toolParams);
}

type SchemaConversionError = {
  readonly _tag: 'schemaConversion';
  readonly error: Error;
};

const SchemaConversionError = (error: Error): SchemaConversionError => ({
  _tag: 'schemaConversion',
  error,
});

function convertToJsonSchema<F extends ZodObjectAny, S extends string>(
  toolParams: ToolParams<F, S>
): Effect.Effect<Tool, SchemaConversionError> {
  return pipe(
    toolParams,
    (toolParams) =>
      pipe(
        Effect.try(() => zodToJsonSchema(toolParams.schema)),
        Effect.mapBoth({
          onSuccess: (jsonSchema) => jsonSchema as JsonSchema7ObjectType,
          onFailure: (error) => SchemaConversionError(error as Error),
        })
      ),
    Effect.map(
      (jsonSchema) =>
        ({
          input_schema: jsonSchema,
          name: toolParams.name,
          description: toolParams.description,
        }) as Tool
    )
  );
}

export function createTool<F extends ZodObjectAny, S extends string>(
  toolParams: ToolParams<F, S>
) {
  return pipe(toolParams, validateTool, Effect.flatMap(convertToJsonSchema));
}
