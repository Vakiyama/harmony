import {
  Accessor,
  Setter,
  Show,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { Image, ImageRoot } from "~/components/ui/image";
import Tail from "../images/Tail.svg";
import HarmonyMascot from "../images/harmony-mascot-container.svg";
import Soundwave from "../images/BsSoundwave.svg";
import { harmonyChat } from "~/api/claude/chat";
import SolidMarkdown from "@zentered/solid-markdown";
import "./markdown.css";
import { A, CustomResponse } from "@solidjs/router";
import { ArrayMessage } from "~/api/claude/effectGraph/messages";
import { ToolUse } from "~/api/claude/effectGraph/callClaude";
import { getUser } from "~/api/server";

export function useHarmonyChat(
  user: Accessor<
    | {
        id: number;
        firstName: string;
        lastName: string;
        photo: string | null;
      }
    | undefined
  >,
) {
  const [messages, setMessages] = createSignal<ArrayMessage[]>([]);

  async function handleConversation(messages: ArrayMessage[]) {
    if (!user()) return;
    const response = await harmonyChat(messages, user()!.id);
    if (!response) return;

    setMessages(response);
  }

  return {
    messages,
    setMessages,
    handleConversation,
  };
}

export function HarmonyChat() {
  const [input, setInput] = createSignal<string>("");
  const [lastMessage, setLastMessage] = createSignal<HTMLDivElement>();
  const [user, setUser] = createSignal<Awaited<ReturnType<typeof getUser>>>();

  const { messages, setMessages, handleConversation } = useHarmonyChat(user);

  onMount(async () => {
    setUser(await getUser());
  });

  createEffect(() => {
    if (lastMessage() === undefined) return;
    lastMessage()!.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [lastMessage]);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const newMessages = [
      ...messages(),
      { role: "user", content: input() } as const,
    ];
    setMessages((oldMessages) => [
      ...oldMessages,
      { role: "user", content: input() } as const,
    ]);
    setInput("");

    console.log(newMessages, "messages sent to claude");
    handleConversation(newMessages);

    // add user message
    // send to claude
    // get response
    // update messages
  }

  interface TimeRange<T = string> {
    startHour: number;
    endHour: number;
    label: T;
  }

  function getTimePeriod<T>(
    currentDate: Date,
    ranges: TimeRange<T>[],
  ): T | undefined {
    const currentHour = currentDate.getHours();

    for (const range of ranges) {
      if (currentHour >= range.startHour && currentHour < range.endHour) {
        return range.label;
      }
    }

    return undefined;
  }

  const currentTimeOfDay = getTimePeriod(new Date(), [
    { startHour: 5, endHour: 12, label: "Morning" },
    { startHour: 12, endHour: 18, label: "Afternoon" },
    { startHour: 18, endHour: 24, label: "Evening" },
    { startHour: 0, endHour: 5, label: "Evening" },
  ]);

  return (
    <div class="bg-white h-full relative overflow-hidden text-lg">
      <form onSubmit={handleSubmit} class="h-full">
        <div class="flex flex-col overflow-scroll h-[calc(100%_-_85px)]">
          <Show
            when={messages().length > 0}
            fallback={
              <Show when={messages().length === 0}>
                <div class="flex flex-col items-center justify-center h-full">
                  <div class="flex flex-col items-center w-full">
                    <ImageRoot class="rounded-none w-60 h-60">
                      <Image src={HarmonyMascot} class="w-full" />
                    </ImageRoot>
                    <Show when={user()}>
                      <h2 class="text-4xl my-1 w-full px-4 text-center max-w-none block">
                        Good {currentTimeOfDay}, {user()!.firstName}!
                      </h2>
                    </Show>
                    <h3 class="opacity-50">What can I help with today?</h3>
                  </div>
                </div>
              </Show>
            }
          >
            {messages()
              .filter(
                // remove all "tool_result" messages
                (message) =>
                  !(
                    message.role === "user" &&
                    !(typeof message.content === "string")
                  ),
              )
              .map((message, index) => (
                <HarmonyChatMessage
                  message={message}
                  index={index}
                  setLastMessage={setLastMessage}
                  messages={messages}
                />
              ))}
          </Show>
        </div>
        <div class="flex flex-row px-2 gap-3 border-t-gray-600 border-t pt-2 pb-6">
          <input
            class="w-full rounded-full px-3 py-2 border border-gray-400"
            value={input()}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Harmony..."
          />
          <button class="rounded-full p-px bg-white">
            <A
              href="/harmony-ai/voice"
              class="flex items-center justify-center"
            >
              <ImageRoot class="h-7 w-7 flex items-center justify-center">
                <Image height="30px" width="30px" src={Soundwave} class="h-7" />
              </ImageRoot>
            </A>
          </button>
        </div>
      </form>
    </div>
  );
}

function HarmonyChatMessage(props: {
  message: ArrayMessage;
  index: number;
  setLastMessage: Setter<HTMLDivElement | undefined>;
  messages: Accessor<ArrayMessage[]>;
}) {
  return (
    <div
      class={twMerge(
        "flex items-center relative max-w-[90%]",
        props.message.role === "user"
          ? "self-end flex-row-reverse mr-1 "
          : "self-start flex-row",
      )}
    >
      <div
        class={twMerge(
          "rounded-xl p-2 my-3 mx-1 w-fit text-gray-800 px-4",
          props.message.role === "user" ? "rounded-br-none bg-[#937AEE]" : "",
        )}
      >
        {props.message.role === "user" ? (
          <p class="text-white">{props.message.content as string}</p>
        ) : typeof props.message.content === "string" ? (
          <div
            class="pb-4"
            ref={
              props.index === props.messages().length - 1
                ? props.setLastMessage
                : undefined
            }
          >
            <SolidMarkdown class="markdown" children={props.message.content} />
          </div>
        ) : (
          <div
            class="pb-4"
            ref={
              props.index === props.messages().length - 1
                ? props.setLastMessage
                : undefined
            }
          >
            <div>
              Harmony using tool: {(props.message.content as [ToolUse])[0].name}
            </div>
          </div>
        )}
      </div>
      <Show when={props.message.role === "user"}>
        <div class={twMerge("absolute bottom-[24px] w-2 h-2 right-[2px]")}>
          <ImageRoot class="w-full">
            <Image src={Tail} alt="" class="relative bottom-px" />
          </ImageRoot>
        </div>
      </Show>
    </div>
  );
}
