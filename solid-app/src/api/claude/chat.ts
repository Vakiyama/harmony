"use server";

import { z } from "zod";
import { createTool } from "./effectGraph/toolUse";
import {
  ArrayMessage,
  Message,
  createMessage,
  getFirst,
  getLast,
  unwrapMessages,
  wrapMessages,
} from "./effectGraph/messages";
import { State, createGraph, nextGraph } from "./effectGraph/graph";
import { Cause, Effect, Either, Exit, Match, Option, pipe } from "effect";
import {
  TextResponse,
  callClaudeWithTools,
  defaultClaudeSettings,
} from "./effectGraph/callClaude";
import { db } from "../db";
import { moods } from "../../../drizzle/schema/Moods";
import { sleeps } from "../../../drizzle/schema/Sleeps";
import { notes } from "../../../drizzle/schema/Notes";
import { meals } from "../../../drizzle/schema/Meals";
import { medications } from "../../../drizzle/schema/Medications";
import { InferSelectModel } from "drizzle-orm";

// we need to:
// give claude access to the user's db so that we can fetch
//
// This feels like a problem where can give claude a simple query client for user related data,
// instead of building a highly abstracted query client
//
// medication info
// meals info
// sleep info
// mood info
// notes info
//
// claude also needs to be able to:
// create all journal entries
// create calendar events
//
// it's clearly too dangerous to let claude freely query the db
// claude is also likely to make a mistake when creating if it's running raw sql queries?

const CHAT_SYSTEM_MESSAGE = `
You are a helpful assitant to a caretaker.
You have access to a journal that contains notes the caretaker may have taken. Use it to assist your user.
`;

const categories = ["medication", "meals", "sleep", "mood", "notes"] as const;

const queryJournalToolSchema = z.object({
  category: z.enum(categories),
});

// simplest case; get * from "journal" | "sleep" | "meals" | ...
const queryJournalToolDefinition = Effect.runSync(
  createTool({
    name: "getJournalEntries",
    description:
      "Use this tool to get all journal entries related to the recepient for a given category.",
    schema: queryJournalToolSchema,
  }),
);

class QueryJournalDBError {
  readonly _tag = "QueryJournalDBError";
  error: unknown;

  constructor(error: unknown) {
    this.error = error;
  }
}

function queryJournalTool(params: z.infer<typeof queryJournalToolSchema>) {
  console.log("called with:", params);
  const result = Match.value(params).pipe(
    Match.when({ category: "mood" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(moods),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "sleep" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(sleeps),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "notes" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(notes),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "meals" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(meals),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "medication" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(medications),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.exhaustive,
  );
  console.log(result);
  return result;
}

type GraphState = {
  messages: Message;
  queries: { category: (typeof categories)[number]; value: string }[];
  readonly key: string;
};

const chatNode = (state: GraphState) => {
  return pipe(
    state,
    ({ messages }) =>
      callClaudeWithTools({
        claudeSettings: defaultClaudeSettings,
        system: CHAT_SYSTEM_MESSAGE,
        retryCount: 5,
        messages: messages,
        type: "tools",
        toolChoice: { type: "any" },
        tools: [queryJournalToolDefinition],
      }),
    Effect.flatMap((result) =>
      pipe(
        result,
        Either.match({
          onLeft: (result) => {
            const newMessage = createMessage({
              role: "user",
              content: (result.content[0] as TextResponse).text,
              prev: Option.some(state.messages),
            });
            state.messages.next = Option.some(newMessage);
            return Effect.succeed({
              key: "chat" as const,
              state: { ...state, messages: getFirst(state.messages) },
            });
          },
          onRight: (toolCall) =>
            pipe(
              toolCall.params,
              queryJournalTool,
              Effect.map((callResult) => {
                return {
                  key: "chat" as const,
                  state: {
                    ...state,
                    queries: [
                      ...state.queries,
                      {
                        category:
                          queryJournalToolDefinition.name as (typeof categories)[number],
                        value: JSON.stringify(callResult),
                      } as const,
                    ],
                  },
                };
              }),
            ),
        }),
      ),
    ),
  );
};

const chatGraph = createGraph<GraphState>()({
  chat: chatNode,
});

const chatStates: (State<typeof chatGraph> & { id: string })[] = [];

export const harmonyChat = async (message: ArrayMessage[], id: string) => {
  const index = chatStates.findIndex((state) => state.id === id);
  if (index === -1) {
    chatStates.push({
      messages: Option.getOrThrow(wrapMessages(message)),
      queries: [],
      key: "chat" as const,
      id,
    });
  }

  const result = nextGraph({
    state: index === -1 ? chatStates.at(-1)! : chatStates.at(-1)!,
    graph: chatGraph,
  });
  const next = await Effect.runPromiseExit(result);
  console.log("called!");

  return next.pipe(
    Exit.match({
      onFailure: (cause) => {
        cause.pipe(Cause.pretty, console.log);
      },
      onSuccess: (next) => {
        if (index === -1) chatStates[chatStates.length - 1] = { ...next, id };
        else chatStates[chatStates.length - 1] = { ...next, id };

        console.log(next, "next!");
        // @ts-ignore;
        console.log(next.state.messages);
        // @ts-ignore;
        console.log(getLast(next.state.messages), "get last!");
        // @ts-ignore;
        const unwrapped = unwrapMessages(getLast(next.state.messages));
        console.log(unwrapped, "unwrapped");
        return unwrapped;
      },
    }),
  );
};
