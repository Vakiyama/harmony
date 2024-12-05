import { Match, Option, pipe } from "effect";
import { ToolUse } from "./callClaude";

export type Option<T> = Option.Option<T>;
export type UnwrapOption<T> = T extends Option<infer U> ? U : never;

type BaseMessage = {
  prev: Option<Message>;
};

export type Message = UserMessage | AssistantMessage;

type ToolResult = {
  type: "tool_result";
  tool_use_id: string;
  content: string;
};

export type UserMessage = {
  role: "user";
  content: string | [ToolResult];
  next: Option<UserMessage | AssistantMessage>;
} & BaseMessage;

export type AssistantMessage = {
  role: "assistant";
  content: string | [ToolUse];
  next: Option<UserMessage>;
} & BaseMessage;

export function getFirst(message: Message): Message {
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
  messageArgs: Omit<T, "next" | "prev"> & Partial<Pick<T, "next" | "prev">>
): T {
  return {
    ...messageArgs,
    next: messageArgs.next ? Option.some(messageArgs.next) : Option.none,
    prev: messageArgs.prev ? Option.some(messageArgs.prev) : Option.none,
  } as unknown as T;
}

export type ArrayMessage = Omit<Omit<Message, "next">, "prev">;

export function toArray(
  message: Message,
  acc: ArrayMessage[] = []
): ArrayMessage[] {
  return Option.match(message.next as Option.Option<Message>, {
    onSome: (next) => {
      if (!next)
        // for some reason, getting undefined messages in a Option...
        return [...acc, { content: message.content, role: message.role }];

      return toArray(next, [
        ...acc,
        { content: message.content, role: message.role },
      ]);
    },
    onNone: () => [...acc, { content: message.content, role: message.role }],
  });
}

export function toLinkedList(
  messages: ArrayMessage[],
  acc: Option.Option<Message> = Option.none()
): Option.Option<Message> {
  return messages.length === 0
    ? acc
    : pipe(
        acc,
        Option.match({
          onNone: () =>
            toLinkedList(
              messages.slice(1),
              Option.some(createMessage({ ...messages[0] }))
            ),
          onSome: (acc) => {
            getLast(acc).next = Option.some(createMessage({ ...messages[0] }));
            return toLinkedList(messages.slice(1), Option.some(acc));
          },
        })
      );
}
