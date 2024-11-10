"use server";

import { z } from "zod";
import { createTool } from "./effectGraph/toolUse";
import {
  ArrayMessage,
  AssistantMessage,
  Message,
  UserMessage,
  createMessage,
  getFirst,
  getLast,
  toArray,
  toLinkedList,
} from "./effectGraph/messages";
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
import { InferSelectModel, eq } from "drizzle-orm";
import { takenMedications } from "../../../drizzle/schema/TakenMedications";

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

Keep in mind the caretaker is likely not proficient with technology. Therefore,
you should keep your messages concise and friendly!

Try to format responses to be non-technical.

You have access to a journal that contains notes the caretaker may have taken. Use it to assist your user.
The current date is: ${new Date(Date.now()).toLocaleTimeString()}
`;

const categories = ["medication", "meals", "sleep", "mood", "notes"] as const;

const queryJournalToolSchema = z.object({
  category: z.enum(categories),
});

// simplest case; get * from "journal" | "sleep" | "meals" | ...
const queryJournalToolDefinition = Effect.runSync(
  createTool({
    name: "getJournalEntries",
    description: `Use this tool to get all journal entries related to the recepient for a given category.
      If you're given an empty array as your query, there are no journal entries.
      Only call this tool if you need that information, otherwise, just assist the user.
      `,
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

function queryJournalTool(
  params: z.infer<typeof queryJournalToolSchema>,
  userId: number,
) {
  console.log("called with:", params);
  const result = Match.value(params).pipe(
    // please don't ever repeat code this much i'm jsut lazy rn ok
    Match.when({ category: "mood" }, () =>
      Effect.tryPromise({
        try: () =>
          db
            .select()
            .from(moods)
            .leftJoin(notes, eq(notes.id, moods.noteId))
            .where(eq(moods.userId, userId)),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "sleep" }, () =>
      Effect.tryPromise({
        try: () =>
          db
            .select()
            .from(sleeps)
            .leftJoin(notes, eq(notes.id, sleeps.noteId))
            .where(eq(sleeps.userId, userId)),

        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "notes" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(notes).where(eq(notes.userId, userId)),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "meals" }, () =>
      Effect.tryPromise({
        try: () =>
          db
            .select()
            .from(meals)
            .leftJoin(notes, eq(notes.id, meals.noteId))
            .where(eq(meals.userId, userId)),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "medication" }, () =>
      Effect.tryPromise({
        try: () =>
          db
            .select({
              medication: medications,
              journalNotes: { ...takenMedications },
              notes: { ...notes },
            })
            .from(takenMedications)
            .leftJoin(notes, eq(takenMedications.noteId, notes.id))
            .innerJoin(
              medications,
              eq(takenMedications.medicationId, medications.id),
            )
            .where(eq(takenMedications.userId, userId)),

        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.exhaustive,
    Effect.map((result) => ({ result, category: params.category })),
  );
  return result;
}

type GraphState = {
  messages: Message;
};

class InvalidToolArgsError {
  readonly _tag = "InvalidToolArgsError";
}

function chatNode(state: GraphState, userId: number) {
  return pipe(
    state,
    ({ messages }) => {
      const lastMessage = getLast(messages);
      if (lastMessage.role !== "user" && lastMessage.role !== "assistant") {
        throw new Error("Found a tool_call or tool_result message!");
      }

      return callClaudeWithTools({
        claudeSettings: defaultClaudeSettings,
        system: CHAT_SYSTEM_MESSAGE,
        retryCount: 5,
        messages: getFirst(messages),
        type: "tools",
        toolChoice: { type: "auto" },
        tools: [queryJournalToolDefinition],
      });
    },
    Effect.flatMap((result) =>
      pipe(
        result,
        Either.match({
          onLeft: (result) => {
            const newMessage = createMessage({
              role: "assistant",
              content: (result.content[0] as TextResponse).text,
              prev: Option.some(state.messages),
            });
            state.messages.next = Option.some(newMessage);
            return Effect.succeed({
              messages: getFirst(state.messages),
            });
          },
          onRight: (toolCall) =>
            pipe(
              toolCall.toolCall.input,
              (input) =>
                Effect.tryPromise({
                  try: () => Effect.runPromise(queryJournalTool(input, userId)),
                  catch: (e) => new InvalidToolArgsError(),
                }),
              Effect.map((callResult) => {
                const toolCallMessage = createMessage<AssistantMessage>({
                  role: "assistant",
                  content: [toolCall.toolCall],
                });

                toolCallMessage.next = Option.some(
                  createMessage<UserMessage>({
                    role: "user",
                    content: [
                      {
                        type: "tool_result",
                        tool_use_id: toolCall.toolCall.id,
                        content: `Category: ${callResult.category}, Result: ${JSON.stringify(callResult.result, undefined, 2)}`,
                      },
                    ],
                    prev: Option.some(toolCallMessage),
                  }),
                );

                getLast(state.messages).next = Option.some(toolCallMessage);

                return { messages: getFirst(state.messages) };
              }),
            ),
        }),
      ),
    ),
  );
}

const chatStates: { messages: Message; id: number }[] = [];

export const harmonyChat = async (
  message: ArrayMessage[],
  id: number,
): Promise<ArrayMessage[] | void> => {
  const index = chatStates.findIndex((state) => state.id === id);
  if (index === -1) {
    chatStates.push({
      messages: Option.getOrThrow(toLinkedList(message)),
      id,
    });
  }

  if (index !== -1)
    chatStates.at(-1)!.messages = Option.getOrThrow(toLinkedList(message));

  const result = chatNode(
    {
      ...(index === -1 ? chatStates.at(-1)! : chatStates.at(-1)!),
    },
    id,
  );

  const next = await Effect.runPromiseExit(result);

  return next.pipe(
    Exit.match({
      onFailure: (cause) => {
        cause.pipe(Cause.pretty, console.log);
      },
      onSuccess: (next) => {
        if (index === -1) chatStates[chatStates.length - 1] = { ...next, id };
        else chatStates[index] = { ...next, id };

        const unwrapped = toArray(getFirst(next.messages));
        console.log(unwrapped, "response");

        const lastMessage = unwrapped.at(-1);
        if (lastMessage) {
          if (typeof lastMessage.content === "string") {
            return unwrapped;
          }
          if (lastMessage.content[0].type === "tool_result") {
            return harmonyChat(unwrapped, id);
          }
        }
        return unwrapped;
      },
    }),
  );
};
