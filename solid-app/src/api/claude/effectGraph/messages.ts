import { Match, Option, pipe } from "effect";

export type Option<T> = Option.Option<T>;
export type UnwrapOption<T> = T extends Option<infer U> ? U : never;

type BaseMessage = {
  content: string;
  prev: Option<Message>;
};

export type Message = UserMessage | AssistantMessage | ToolCall | ToolResult;

export type UserMessage = {
  role: "user";
  next: Option<UserMessage | AssistantMessage>;
} & BaseMessage;

export type AssistantMessage = {
  role: "assistant";
  next: Option<UserMessage>;
} & BaseMessage;

export type ToolCall = {
  role: "tool_call";
  next: Option<ToolResult>;
} & BaseMessage;

export type ToolResult = {
  role: "tool_result";
  next: Option<UserMessage | AssistantMessage | ToolCall>;
} & BaseMessage;

export function getFirst(message: Message): Message {
  console.log(message, "getFirst");
  return Option.match(message.prev, {
    onSome: (prev) => {
      if (!prev) return message;
      return getFirst(prev);
    },
    onNone: () => message,
  });
}

export function getLast(message: Message): Message {
  return Option.match(message.next as Option.Option<Message>, {
    onSome: (next) => {
      if (!next) return message;
      return getLast(next);
    },
    onNone: () => message,
  });
}

export function createMessage<T extends Message>(
  messageArgs: Omit<T, "next" | "prev"> & Partial<Pick<T, "next" | "prev">>,
): T {
  return {
    ...messageArgs,
    next: messageArgs.next ? Option.some(messageArgs.next) : Option.none,
    prev: messageArgs.prev ? Option.some(messageArgs.prev) : Option.none,
  } as unknown as T;
}

export type ArrayMessage = Omit<Omit<Message, "next">, "prev">;

export function unwrapMessages(
  message: Message,
  acc: ArrayMessage[] = [],
): ArrayMessage[] {
  return Option.match(message.next as Option.Option<Message>, {
    onSome: (next) => {
      if (!next)
        return [...acc, { content: message.content, role: message.role }];

      return unwrapMessages(next, [
        ...acc,
        { content: message.content, role: message.role },
      ]);
    },
    onNone: () => [...acc, { content: message.content, role: message.role }],
  });
}

export function wrapMessages(
  messages: ArrayMessage[],
  acc: Option.Option<Message> = Option.none(),
): Option.Option<Message> {
  return messages.length === 0
    ? acc
    : pipe(
      acc,
      Option.match({
        onNone: () =>
          wrapMessages(
            messages.slice(1),
            Option.some(createMessage({ ...messages[0] })),
          ),
        onSome: (acc) => {
          console.log("new msg", messages[0]);
          getLast(acc).next = Option.some(createMessage({ ...messages[0] }));
          return wrapMessages(messages.slice(1), Option.some(acc));
        },
      }),
    );
}
