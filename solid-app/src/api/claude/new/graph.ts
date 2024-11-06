import { Effect, pipe } from 'effect';
import {
  callClaudeWithFormat,
  callClaudeWithoutFormat,
  defaultClaudeSettings,
} from './callClaude';
import { createMessage } from './messages';
import { z } from 'zod';

type ExtractEffectError<T> = T extends Effect.Effect<any, infer E> ? E : never;

type ExtractContext<G> = G extends Graph<any, any, infer C> ? C : never;
type ExtractError<G> = G extends Graph<any, infer E, any> ? E : never;

type Graph<K extends string, E, C> = {
  readonly [P in K]: (state: C) => Effect.Effect<{ key: K; state: C }, E>;
};

type GraphDefinition<K extends string, E, C> = {
  [P in K]: (
    state: C
  ) => Effect.Effect<
    { key: K; state: C },
    E extends ExtractEffectError<ReturnType<(state: C) => Effect.Effect<K, E>>>
    ? E
    : never
  >;
};

function createGraph<C>() {
  return function <K extends string, E>(
    definition: GraphDefinition<K, E, C>
  ): Graph<K, E, C> {
    return Object.fromEntries(
      (
        Object.entries(definition) as [K, (state: C) => Effect.Effect<any, E>][]
      ).map(([key, value]) => [key, value])
    ) as Graph<K, E, C>;
  };
}

type State<G extends Graph<string, any, any>> = {
  nextNode: keyof G | 'exit';
} & ExtractContext<G>;

function nextGraph<G extends Graph<string, any, any>>(params: {
  state: State<G>;
  graph: G;
}): Effect.Effect<State<G>, ExtractError<G>> {
  return pipe(
    params,
    (params) => params.graph[params.state.nextNode],
    (p) => p(params.state)
  ) as Effect.Effect<State<G>, ExtractError<G>>;
}

type Context = {
  test: string;
};

const graph = createGraph<Context>()({
  start: (c) =>
    pipe(
      callClaudeWithoutFormat({
        type: 'default',
        claudeSettings: defaultClaudeSettings,
        system: `Respond with a fun joke. Please describe your joke creation process step by step.
Before answering, explain your reasoning step-by-step in tags.
        `,
        messages: createMessage({
          role: 'user',
          content: 'Give me a joke about rain.',
        }),
        retryCount: 5,
      }),
      Effect.map((response) => ({ key: 'start', state: { test: 'endStart' } }))
    ),
  end: (c) =>
    pipe(
      callClaudeWithFormat({
        type: 'format',
        claudeSettings: defaultClaudeSettings,
        system: `Respond with a fun joke. Please describe your joke creation process step by step.
Before answering, explain your reasoning step-by-step in tags.
        `,
        messages: createMessage({
          role: 'user',
          content: 'Give me a joke about rain.',
        }),
        retryCount: 5,
        jsonFormat: { retryLimit: 5, format: z.object({ joke: z.string() }) },
      }),
      Effect.map((response) => ({ key: 'end', state: { test: 'endEnd' } }))
    ),
});

const next = nextGraph({ state: { test: '', nextNode: 'start' }, graph });

const result = await Effect.runPromise(next);
console.log(result);
