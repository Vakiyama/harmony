"use server";

import { createInsertSchema } from "drizzle-zod";
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
  AssistantResponse,
  TextResponse,
  ToolCallResult,
  callClaudeWithTools,
  defaultClaudeSettings,
} from "./effectGraph/callClaude";
import { db } from "../db";
import { moods } from "../../../drizzle/schema/Moods";
import { sleeps } from "../../../drizzle/schema/Sleeps";
import { notes } from "../../../drizzle/schema/Notes";
import { meals } from "../../../drizzle/schema/Meals";
import { medications } from "../../../drizzle/schema/Medications";
import { eq } from "drizzle-orm";
import { takenMedications } from "../../../drizzle/schema/TakenMedications";

const CHAT_SYSTEM_MESSAGE = `
You are a helpful assitant to a caretaker. Your name is "Harmony".

Keep in mind the caretaker is likely not proficient with technology. Therefore,
you should keep your messages concise and friendly!

Try to format responses to be non-technical.

You have access to a journal that contains notes the caretaker may have taken. Use it to assist your user.
The current date is: ${new Date(Date.now()).toLocaleTimeString()}
`;

const categories = ["medication", "meals", "sleep", "mood", "notes"] as const;
const journalTables = {
  medications,
  meals,
  sleeps,
  moods,
  notes,
};

const takenMedicationsSchema = createInsertSchema(takenMedications);
const mealsSchema = createInsertSchema(meals);
const sleepSchema = createInsertSchema(sleeps);
const moodSchema = createInsertSchema(moods);
const notesSchema = createInsertSchema(notes);

const omitValues = { createdAt: true, id: true, updatedAt: true } as const;

const createJournalEntryToolSchema = z.object({
  entry: z.discriminatedUnion("category", [
    z.object({
      category: z.literal("takenMedications"),
      values: takenMedicationsSchema.omit(omitValues),
    }),
    z.object({
      category: z.literal("meals"),
      values: mealsSchema.omit(omitValues),
    }),
    z.object({
      category: z.literal("sleeps"),
      values: sleepSchema.omit(omitValues),
    }),
    z.object({
      category: z.literal("moods"),
      values: moodSchema.omit(omitValues),
      withNote: z.optional(notesSchema.omit(omitValues)),
    }),
    z.object({
      category: z.literal("notes"),
      values: notesSchema.omit(omitValues),
    }),
  ]),
});

const createJournalEntryToolDefinition = Effect.runSync(
  createTool({
    name: "createJournalEntry",
    description: `
    Use this tool to create a journal entry per the request of the user.
    Ask questions necessary if you're missing information.
    Once you have enough information from the user, ask for a confirmation message before using this tool.
    If the user confirms the creation of the journal entry, use this tool.

    All categories except for notes can have a noteId attached to it for extra info! If this is the case

    There are 5 categories: ${categories.join(", ")}

    Give the correct category and respective values as per the schema. 
    `,
    schema: createJournalEntryToolSchema,
  }),
);

class InvalidCategoryForJournalCreationError {
  readonly _tag = "InvalidCategoryForJournalCreationError";
}

class InsertDBError {
  readonly _tag = "InsertDBError";
  error: unknown;
  toolCall: CreateJournalEntryToolUse;

  constructor(e: unknown, toolCall: CreateJournalEntryToolUse) {
    this.error = e;
    this.toolCall = toolCall;
  }
}

type CreateJournalEntryToolUse = {
  name: "createJournalEntry";
  id: string;
  type: "tool_use";
  input: any;
};

function createJournalTool(params: {
  entry: z.infer<typeof createJournalEntryToolSchema>["entry"];
  userId: number;
  toolCall: CreateJournalEntryToolUse;
}) {
  const value = Object.entries(journalTables).find(
    ([key]) => key === params.entry.category,
  );
  return pipe(
    Effect.try({
      try: () => {
        if (!value) throw new Error();
      },
      catch: () => new InvalidCategoryForJournalCreationError(),
    }),
    Effect.flatMap(() =>
      Effect.tryPromise({
        try: () => {
          const result = db
            .insert(journalTables[value![0] as keyof typeof journalTables])
            .values(params.entry.values)
            .returning();
          return result;
        },
        catch: (e) => new InsertDBError(e, params.toolCall),
      }),
    ),
  );
}

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

class ToolNameNotFound {
  readonly _tag = "ToolNameNotFound";
}

const claudeTools = [
  queryJournalToolDefinition,
  createJournalEntryToolDefinition,
] as const;

function makeClaudeToolCall(result: GraphState) {
  return callClaudeWithTools({
    claudeSettings: defaultClaudeSettings,
    system: CHAT_SYSTEM_MESSAGE,
    retryCount: 5,
    messages: getFirst(result.messages),
    type: "tools",
    toolChoice: { type: "auto" },
    tools: [...claudeTools],
  });
}

type ExtractValue<T> = T extends Effect.Effect<infer R, any, any> ? R : never;

function handleNoToolCall(
  assitantResponse: AssistantResponse,
  state: GraphState,
) {
  const newMessage = createMessage({
    role: "assistant",
    content: (assitantResponse.content[0] as TextResponse).text,
    prev: Option.some(state.messages),
  });
  getLast(state.messages).next = Option.some(newMessage);
  return Effect.succeed({
    messages: getFirst(state.messages),
  });
}

function handleToolCall(
  toolCall: ToolCallResult<[]>,
  state: GraphState,
  userId: number,
) {
  return pipe(toolCall, (toolCall) =>
    Match.value(toolCall.toolCall).pipe(
      Match.when({ name: "getJournalEntries" }, (toolCall) =>
        pipe(
          queryJournalTool(toolCall.input, userId),
          Effect.map((callResult) => {
            const toolCallMessage = createMessage<AssistantMessage>({
              role: "assistant",
              content: [toolCall],
            });

            toolCallMessage.next = Option.some(
              createMessage<UserMessage>({
                role: "user",
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: toolCall.id,
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
      ),
      Match.when({ name: "createJournalEntry" }, (toolCall) =>
        pipe(
          createJournalTool({
            entry: toolCall.input.entry,
            userId,
            toolCall,
          }),
          Effect.map((_) => {
            const toolCallMessage = createMessage<AssistantMessage>({
              role: "assistant",
              content: [toolCall],
            });

            toolCallMessage.next = Option.some(
              createMessage<UserMessage>({
                role: "user",
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: toolCall.id,
                    content: `Success!`,
                  },
                ],
                prev: Option.some(toolCallMessage),
              }),
            );

            getLast(state.messages).next = Option.some(toolCallMessage);

            return { messages: getFirst(state.messages) };
          }),
        ),
      ),
      Match.orElse(() => Effect.fail(new ToolNameNotFound())),
    ),
  );
}

function handleClaudeResponse(
  result: ExtractValue<ReturnType<typeof makeClaudeToolCall>>,
  state: GraphState,
  userId: number,
) {
  return Either.match(result, {
    onLeft: (res) => handleNoToolCall(res, state),
    onRight: (toolCall) => handleToolCall(toolCall, state, userId),
  });
}

function chat(state: GraphState, userId: number) {
  return pipe(
    state,
    makeClaudeToolCall,
    Effect.flatMap((result) => handleClaudeResponse(result, state, userId)),
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
    chatStates[index]!.messages = Option.getOrThrow(toLinkedList(message));

  const result = chat(
    {
      ...(index === -1 ? chatStates.at(-1)! : chatStates[index]!),
    },
    id,
  );

  const next = await Effect.runPromiseExit(
    pipe(
      result,
      Effect.catchTag("InsertDBError", (error) => {
        {
          const toolCallMessage = createMessage<AssistantMessage>({
            role: "assistant",
            content: [error.toolCall],
          });

          toolCallMessage.next = Option.some(
            createMessage<UserMessage>({
              role: "user",
              content: [
                {
                  type: "tool_result",
                  tool_use_id: error.toolCall.id,
                  content: `Failed with error: ${error.error}`,
                },
              ],
              prev: Option.some(toolCallMessage),
            }),
          );

          const last = getLast(Option.getOrThrow(toLinkedList(message)));

          if (last.role === "assistant") throw new Error();

          last.next = Option.some(toolCallMessage);

          return chat({ messages: getFirst(last) }, id);
        }
      }),
      // Effect.retry({ times: 5 }),
    ),
  );

  return next.pipe(
    Exit.match({
      onFailure: (cause) => {
        cause.pipe(Cause.pretty, console.error);
      },
      onSuccess: (next) => {
        if (index === -1) chatStates[chatStates.length - 1] = { ...next, id };
        else chatStates[index] = { ...next, id };

        const unwrapped = toArray(getFirst(next.messages));

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
