import { Option } from 'effect';

export type Option<T> = Option.Option<T>;
export type UnwrapOption<T> = T extends Option<infer U> ? U : never;

type BaseMessage = {
  content: string;
  prev: Option<Message>;
};

export type Message = UserMessage | AssistantMessage;

export type UserMessage = {
  role: 'user';
  next: Option<UserMessage | AssistantMessage>;
} & BaseMessage;

export type AssistantMessage = {
  role: 'assistant';
  next: Option<UserMessage>;
} & BaseMessage;

export function getFirst(message: Message): Message {
  return Option.match(message.prev, {
    onSome: (prev) => getFirst(prev),
    onNone: () => message,
  });
}

export function getLast(message: Message): Message {
  return Option.match(message.next as Option<Message>, {
    onSome: (next) => getLast(next),
    onNone: () => message,
  });
}

export function createMessage<T extends Message>(
  messageArgs: Omit<Omit<T, 'next'>, 'prev'>
): T {
  return {
    ...messageArgs,
    next: Option.none(),
    prev: Option.none(),
  } as T;
}

export function unwrapMessages(
  message: Message,
  acc: Omit<Omit<Message, 'next'>, 'prev'>[] = []
): Omit<Omit<Message, 'next'>, 'prev'>[] {
  return Option.match(message.next, {
    onSome: (next) =>
      unwrapMessages(next, [
        ...acc,
        { content: message.content, role: message.role },
      ]),
    onNone: () => [...acc, { content: message.content, role: message.role }],
  });
}
