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
import {
  Cause,
  Effect,
  Either,
  Exit,
  Match,
  Option,
  Schedule,
  pipe,
} from "effect";
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
import { users } from "../../../drizzle/schema/Users";
import { teams } from "../../../drizzle/schema/Teams";
import { recipients } from "../../../drizzle/schema/Recipients";
import { journals } from "../../../drizzle/schema/Journals";
import { getJournalsFromTeamId, getMedicationsFromTeamId } from "../journal";
import {
  getCalendar,
  getCalendarFromTeamId,
  getCalendarFromTeamIdWithEvents,
} from "../calendar";
import { events } from "../../../drizzle/schema/Events";
import { getTeamFromTeamId } from "../team";

const CHAT_SYSTEM_MESSAGE = `
You are a helpful assitant to a caretaker. Your name is "Harmony".

You are assiting an individual that may be in a team of caretakers. They take care of
a recipient.

Keep in mind the caretaker is likely not proficient with technology. Therefore,
you should keep your messages concise and friendly!

Try to format responses to be non-technical.

You have access to a journal that contains notes the caretaker may have taken. Use it to assist your user.
Keep in mind, the caretaker notes are for the recipient.

For example, the caretaker may ask you to create a mood entry. This is an entry to log the mood
of the recipient.

Make sure all your requests are natural, for example, when asking for a date or time, don't specify
the format, just ask for more info if you need. This goes for all things. When doing a mood entry
for example, don't ask for SUPER AWESOME, but ask for super awesome as one of the mood options, since 
all caps isn't very natural.

When asking for info, try to be conversational as much as possible! Instead of asking for 7 different things at once,
ask for them one at a time. This will keep the caretaker more engaged and less confused!

The current date is: ${new Date(Date.now()).toLocaleTimeString()}
`;

const CHAT_SYSTEM_MESSAGE_WITH_VOICE = `
${CHAT_SYSTEM_MESSAGE}

## Additional info:
You're currently operating in voice mode. This means the following:

Be more conversational in tone. Don't format responses in markdown, just in plain text. Your text
will be spoken, so keep that in mind.

Don't include any symbols for formatting! Omit dashes, for example. If you need to break up your text, do it with
periods and commas.

Also, try to ignore any typos in the message. We're picking up from the users microphone, so it might not format
perfectly. Your name may be misheard as something like Hermiony, Hermny, so on. Just assume they meant Harmony.

If you need to ask a series of questions, break it up into multiple conversation parts by asking one at a time.
Your responses need to be at most 2 sentences long, with shorter, spoken sentences preferable.

Don't repeat information, or reference "creating an event with the x function". Users will become impatient if 
they have to listen to your messages for long periods of time, especially if they're repeating information.

If you must repeat information, for example to confirm a task, it must be very concise.

`;

const categories = ["medication", "meal", "sleep", "mood", "note"] as const;

const journalTables = {
  medication: takenMedications,
  meal: meals,
  sleep: sleeps,
  mood: moods,
  note: notes,
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
      category: z.literal("medication"),
      values: takenMedicationsSchema.omit({ ...omitValues, noteId: true }),
      medicationName: z.string(),
      withNote: z.optional(notesSchema.omit(omitValues)),
    }),
    z.object({
      category: z.literal("meal"),
      values: mealsSchema.omit({ ...omitValues, noteId: true }),
      withNote: z.optional(notesSchema.omit(omitValues)),
    }),
    z.object({
      category: z.literal("sleep"),
      values: sleepSchema.omit({ ...omitValues, noteId: true }),
      withNote: z.optional(notesSchema.omit(omitValues)),
    }),
    z.object({
      category: z.literal("mood"),
      values: moodSchema.omit({ ...omitValues, noteId: true }),
      withNote: z.optional(notesSchema.omit(omitValues)),
    }),
    z.object({
      category: z.literal("note"),
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

    The current time is: ${new Date().toLocaleString()}
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
  toolCall: ToolUse;

  constructor(e: unknown, toolCall: ToolUse) {
    this.error = e;
    this.toolCall = toolCall;
  }
}

type ToolUse = {
  name: string;
  id: string;
  type: "tool_use";
  input: any;
};

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
        try: async () => {
          let noteId: number | undefined;
          if (params.entry.category !== "note" && params.entry.withNote) {
            const result = await db
              .insert(notes)
              .values(params.entry.withNote)
              .returning();
            noteId = result[0].id;
          }

          if (
            params.entry.category === "medication" &&
            params.entry.values.date
          ) {
            params.entry.values.date = new Date(params.entry.values.date);
          }

          const result = await db
            .insert(journalTables[value![0] as keyof typeof journalTables])
            .values(
              noteId
                ? ({ ...params.entry.values, noteId } as any)
                : params.entry.values,
            )
            .returning();

          await db.insert(journals).values({
            type: params.entry.category,
            entryId: result[0].id,
          });

          return result;
        },
        catch: (e) => new InsertDBError(e, params.toolCall),
      }),
    ),
  );
}

const eventCreationSchema = createInsertSchema(events).omit({
  id: true,
  calendarId: true,
});

const createCalendarEventToolSchema = z.object({
  event: eventCreationSchema,
});

const createCalendarEventToolDefinition = Effect.runSync(
  createTool({
    name: "createCalendarEvent",
    schema: createCalendarEventToolSchema,
    description: `
    Use this tool to create a calendar event.

    When asking for a time range, make sure to ask for start and end times in a human readable way.
    If you don't have exactly the data you need, just ask naturally.

    Ignore the schema for timeStart, timeStart is required, not optional, it must be included!

    timeStart and timeEnd should be parsable by the javascript new Date() constructor and will be fed directly to it.
    `,
  }),
);

function createCalendarEventTool(
  params: z.infer<typeof eventCreationSchema>,
  teamId: number,
  toolUse: ToolUse,
) {
  return pipe(
    Effect.tryPromise({
      try: () => getCalendarFromTeamId(teamId),
      catch: (e) => {
        console.error(e);
        return new QueryDBError(e);
      },
    }),
    Effect.flatMap((calendars) =>
      Effect.tryPromise({
        try: () =>
          db.insert(events).values({
            ...params,
            timeStart: new Date(params.timeStart!),
            timeEnd: params.timeEnd ? new Date(params.timeEnd) : undefined,
            calendarId: calendars.id,
          }),
        catch: (e) => {
          console.error(e);
          return new InsertDBError(e, toolUse);
        },
      }),
    ),
  );
}

const queryCalendarToolSchema = z.object({
  startDate: z
    .string()
    .describe(
      "A date in A date in MM/DD/YYYY format. Example: 11/01/2024. This is the start of the time range you are querying.",
    ),
  endDate: z
    .string()
    .describe(
      "A date in A date in MM/DD/YYYY format. Example: 12/01/2024. This is the end of the time range you are querying.",
    ),
});

const queryCalendarToolDefinition = Effect.runSync(
  createTool({
    name: "getCalendar",
    description: `Use this tool to get all calendar entries in a given time range. The entries in this range will include
    events and tasks, as well as journal entries.

    Journal entries can be one of:
    Mood, Sleep, Generic Notes, Nutrition and Medication.

    Each contains information taken by a caretaker by a recipient. They will all be organized by time.

    Events are things like doctors appointments. They're things someone may need to be present for.
    Tasks are things that need to be done. They can be completed.

    The result will be sorted in ascending order (newest items first in the array.)
    `,
    schema: queryCalendarToolSchema,
  }),
);

function queryCalendarTool(
  params: z.infer<typeof queryCalendarToolSchema>,
  teamId: number,
) {
  console.log(params, "params");
  console.log(teamId, "teamId");
  return pipe(
    Effect.tryPromise({
      try: () => getJournalsFromTeamId(teamId),
      catch: (e) => new QueryDBError(e),
    }),
    Effect.flatMap((result) => {
      return pipe(
        Effect.tryPromise({
          try: () => getCalendarFromTeamIdWithEvents(teamId),
          catch: (e) => new QueryDBError(e),
        }),
        Effect.flatMap((calendarResult) =>
          Object.keys(calendarResult).includes("error")
            ? Effect.fail(
              new QueryDBError("Permissions error when querying calendar"),
            )
            : Effect.succeed(calendarResult),
        ),
        Effect.map((calendars) => {
          const eventsAndJournal = {
            events: calendars.map((calendar) => ({
              ...calendar,
              timeStart: calendar.events.timeStart!,
            })),
            journals: result!.map((journal) => ({
              ...journal,
              timeStart: journal.createdAt,
            })),
          };

          const all = [
            ...eventsAndJournal.journals,
            ...eventsAndJournal.events,
          ];
          const sorted = all.toSorted(
            (first, second) =>
              first.timeStart.getTime() - second.timeStart.getTime(),
          );

          return sorted.filter(
            (item) =>
              item.timeStart.getTime() > new Date(params.startDate).getTime() &&
              item.timeStart.getTime() < new Date(params.endDate).getTime(),
          );
        }),
      );
    }),
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
  teamId: number,
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
            .leftJoin(users, eq(users.id, notes.userId))
            .where(eq(moods.userId, teamId)),
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
            .leftJoin(users, eq(users.id, sleeps.userId))
            .where(eq(sleeps.userId, teamId)),

        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "note" }, () =>
      Effect.tryPromise({
        try: () => db.select().from(notes).where(eq(notes.userId, teamId)),
        catch: (error) => new QueryJournalDBError(error),
      }),
    ),
    Match.when({ category: "meal" }, () =>
      Effect.tryPromise({
        try: () =>
          db
            .select()
            .from(meals)
            .leftJoin(notes, eq(notes.id, meals.noteId))
            .leftJoin(users, eq(users.id, meals.userId))
            .where(eq(meals.userId, teamId)),
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
            .leftJoin(users, eq(users.id, takenMedications.userId))
            .innerJoin(
              medications,
              eq(takenMedications.medicationId, medications.id),
            )
            .where(eq(takenMedications.userId, teamId)),

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
  queryCalendarToolDefinition,
  createCalendarEventToolDefinition,
] as const;

class QueryDBError {
  readonly _tag = "QueryDBError";
  error: unknown;

  constructor(e: unknown) {
    this.error = e;
  }
}

async function getUserFromIdStringifed(userId: number) {
  const user = await db.select().from(users).where(eq(users.id, userId));
  if (!user[0]) throw new Error("No user.");
  return JSON.stringify(user[0], undefined, 2);
}

async function getRecipientFromUserId(userId: number, teamId: number) {
  const teamsResults = await db
    .select({ recipient: recipients })
    .from(teams)
    .innerJoin(recipients, eq(teams.recipientId, recipients.id))
    .where(eq(teams.id, teamId));

  const recipient = teamsResults[0];
  if (!recipient) {
    throw new Error("No teams?");
  }
  const formattedInfo = JSON.stringify(recipient.recipient, undefined, 2);

  return {
    recipient: formattedInfo,
    user: await getUserFromIdStringifed(userId),
  };
}

function makeClaudeToolCall(
  result: GraphState,
  id: number,
  teamId: number,
  voice?: boolean,
) {
  return Effect.tryPromise({
    try: () => getRecipientFromUserId(id, teamId),
    catch: (e) => {
      console.error(e);
      return new QueryDBError(e);
    },
  }).pipe(
    Effect.either,
    Effect.flatMap((info) => {
      const extra = info.pipe(
        Either.match({
          onRight: (info) =>
            pipe(
              Effect.tryPromise({
                try: () => getMedicationsFromTeamId(teamId),
                catch: (e) => new QueryDBError(e),
              }),
              Effect.map(
                (medicationInfo) => `
        ## Recipient Information:

          ${info.recipient}

        ### Medications:

          ${JSON.stringify(medicationInfo, undefined, 2)}

        ## User information:

          ${info.user}
`,
              ),
            ),
          onLeft: () =>
            Effect.succeed("") as Effect.Effect<string, QueryDBError>,
        }),
      );
      return pipe(
        extra.pipe(
          Effect.flatMap((extraInfo) =>
            callClaudeWithTools({
              claudeSettings: defaultClaudeSettings,
              system: `${voice ? CHAT_SYSTEM_MESSAGE_WITH_VOICE : CHAT_SYSTEM_MESSAGE}
              ${extraInfo} 
        `,
              retryCount: 5,
              messages: getFirst(result.messages),
              type: "tools",
              toolChoice: { type: "auto" },
              tools: [...claudeTools],
            }),
          ),
        ),
      );
    }),
  );
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
  teamId: number,
) {
  return pipe(toolCall, (toolCall) =>
    Match.value(toolCall.toolCall).pipe(
      Match.when({ name: "createCalendarEvent" }, (toolCall) => {
        return pipe(
          createCalendarEventTool(toolCall.input.event, teamId, toolCall),
          Effect.map(() => {
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
        );
      }),
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
      Match.when({ name: "getCalendar" }, (toolCall) =>
        pipe(
          queryCalendarTool({ ...toolCall.input }, teamId),
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
                    content: JSON.stringify(callResult, undefined, 2),
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
  teamId: number,
) {
  return Either.match(result, {
    onLeft: (res) => handleNoToolCall(res, state),
    onRight: (toolCall) => handleToolCall(toolCall, state, userId, teamId),
  });
}

function chat(
  state: GraphState,
  userId: number,
  teamId: number,
  voice?: boolean,
) {
  return pipe(
    state,
    (state) => makeClaudeToolCall(state, userId, teamId, voice),
    Effect.flatMap((result) =>
      handleClaudeResponse(result, state, userId, teamId),
    ),
  );
}

const chatStates: { messages: Message; id: number }[] = [];

export const harmonyChat = async (
  message: ArrayMessage[],
  id: number,
  teamId: number,
  voice?: boolean,
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
    teamId,
    voice,
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

          return chat({ messages: getFirst(last) }, id, teamId);
        }
      }),
      Effect.retry(
        Schedule.exponential(1000).pipe(Schedule.compose(Schedule.recurs(3))),
      ),
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
        /*
        if (lastMessage) {
          if (typeof lastMessage.content === "string") {
            return unwrapped;
          }

          if (lastMessage.content[0].type === "tool_result") {
            return harmonyChat(unwrapped, id, teamId, voice);
          }
        }
        */
        return unwrapped;
      },
    }),
  );
};
