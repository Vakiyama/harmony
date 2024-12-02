import {
  Accessor,
  Setter,
  Show,
  createEffect,
  createSignal,
  onCleanup,
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
import { A } from "@solidjs/router";
import { ArrayMessage } from "~/api/claude/effectGraph/messages";
import { ToolUse } from "~/api/claude/effectGraph/callClaude";
import { getUser } from "~/api/server";
import { User } from "@/schema/Users";
import TopNav from "~/components/shared/TopNav";
import { useTeam } from "~/context/team-context";

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
  voice?: boolean,
) {
  const [messages, setMessages] = createSignal<ArrayMessage[]>([]);
  const team = useTeam();
  async function handleConversation(messages: ArrayMessage[]) {
    if (!user()) return;
    const response = await harmonyChat(
      messages,
      user()!.id,
      team.state.id,
      voice,
    );
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
  const [textAreaHeightStyle, setTextAreaHeightStyle] = createSignal(10);

  // @ts-ignore
  const { messages, setMessages, handleConversation } = useHarmonyChat(user);

  let textAreaRef!: HTMLTextAreaElement;

  function setTextAreaHeight() {
    if (textAreaRef) {
      console.log(textAreaRef.value, "val");
      setInput(textAreaRef.value);
      if (textAreaRef.value === "") {
        console.log("do the thing!");
        return setTextAreaHeightStyle(44);
      }
      const scrollHeight = textAreaRef.scrollHeight;

      setTextAreaHeightStyle(scrollHeight);
    }
  }

  function handleSubmitWithEnter(e: KeyboardEvent) {
    if (!e.shiftKey && e.key === "Enter") {
      handleSubmit();
      e.preventDefault();
    }
  }

  onMount(async () => {
    setUser(await getUser());
    setTextAreaHeight();
    textAreaRef.addEventListener("input", setTextAreaHeight);
    window.addEventListener("keydown", handleSubmitWithEnter);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleSubmitWithEnter);
    textAreaRef.removeEventListener("input", setTextAreaHeight);
  });

  createEffect(() => {
    if (lastMessage() === undefined) return;
    lastMessage()!.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [lastMessage]);

  function handleSubmit(event?: SubmitEvent) {
    event && event.preventDefault();

    const newMessages = [
      ...messages(),
      { role: "user", content: input() } as const,
    ];
    setMessages((oldMessages) => [
      ...oldMessages,
      { role: "user", content: input() } as const,
    ]);

    console.log(newMessages, "messages sent to claude");
    handleConversation(newMessages);
    setInput("");
    textAreaRef.value = "";
    setTextAreaHeight();

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
      <TopNav
        name="Harmony AI"
        leftNavigation="Home"
        rightNavigation={<div class=""></div>}
        class="border-b-black/15 border bg-white"
      />
      <form onSubmit={handleSubmit} class="h-full">
        <div class="flex flex-col-reverse overflow-scroll h-[calc(100%_-_85px)]">
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
                        Good {currentTimeOfDay}, {(user() as User)!.firstName}!
                      </h2>
                    </Show>
                    <h3 class="opacity-50">What can I help with today?</h3>
                  </div>
                </div>
              </Show>
            }
          >
            {messages()
              .toReversed()
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
        <div class="bg-white w-full flex flex-row px-2 gap-3 border-t-black/25 border-t pt-2 pb-6 h-fit fixed bottom-0">
          <div class="h-fit w-full border-black/25 border rounded-lg flex flex-row items-center">
            <textarea
              ref={textAreaRef}
              style={{ height: `${textAreaHeightStyle()}px` }}
              class="w-full rounded-lg px-3 pr-6 py-2 placeholder:text-black/25 resize-none max-h-[75dvh] focus:outline-none"
              value={input()}
              placeholder="Chat with Harmony..."
            />
            <Show when={input().length > 0}>
              <button
                onClick={() => handleSubmit()}
                class="bg-primary-purple-500 w-[34px] h-[32px] p-1.5 rounded-full mr-2"
              >
                <svg
                  viewBox="0 0 13 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.15407 0.789133C6.79232 0.427385 6.20484 0.427385 5.84309 0.789133L1.21272 5.41951C0.850969 5.78126 0.850969 6.36873 1.21272 6.73048C1.57447 7.09223 2.16194 7.09223 2.52369 6.73048L5.57395 3.67733V12.5561C5.57395 13.0683 5.98779 13.4821 6.50003 13.4821C7.01226 13.4821 7.4261 13.0683 7.4261 12.5561V3.67733L10.4764 6.72759C10.8381 7.08934 11.4256 7.08934 11.7873 6.72759C12.1491 6.36584 12.1491 5.77836 11.7873 5.41661L7.15696 0.786239L7.15407 0.789133Z"
                    fill="#FCFCFC"
                  />
                </svg>
              </button>
            </Show>
          </div>
          <button class="rounded-full p-px bg-white border-black/25 border aspect-square px-[7px]">
            <A
              href="/harmony-ai/voice"
              class="flex items-center justify-center"
            >
              <ImageRoot class="h-7 w-7 flex items-center justify-center opacity-25">
                <Image height="30px" width="30px" src={Soundwave} class="h-7" />
              </ImageRoot>
            </A>
          </button>
        </div>
      </form>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, ms),
  );
}

function HarmonyChatMessage(props: {
  message: ArrayMessage;
  index: number;
  setLastMessage: Setter<HTMLDivElement | undefined>;
  messages: Accessor<ArrayMessage[]>;
}) {
  const filteredLen = props.messages().filter(
    // remove all "tool_result" messages
    (message) =>
      !(message.role === "user" && !(typeof message.content === "string")),
  ).length;

  const [aiMessage, setAiMessage] = createSignal("");

  async function streamMessage(message: ArrayMessage) {
    const sleepRange = { low: 10, high: 40 };
    let messageRangeCutoff = 0;
    while (true) {
      const speedFactor = message.role === "assistant" ? 2.5 : 1;

      await sleep(
        (sleepRange.low + Math.floor(sleepRange.high * Math.random())) /
          speedFactor,
      );

      messageRangeCutoff++;
      const clippedMessage = (message.content as string)
        .split("")
        .reverse()
        .slice(message.content.length - messageRangeCutoff)
        .reverse()
        .join("");

      console.log("setting ai message", clippedMessage);
      setAiMessage(clippedMessage);
      if (messageRangeCutoff === message.content.length) break;
    }
  }

  createEffect(() => {
    if (props.message.role === "assistant") {
      console.log("streaming", props.message);
      streamMessage(props.message);
    }
  });

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
              props.index === filteredLen - 1 ? props.setLastMessage : undefined
            }
          >
            <Show when={aiMessage()} keyed>
              <SolidMarkdown
                class="markdown"
                children={
                  props.index === 0 ? aiMessage() : props.message.content
                }
              />
            </Show>
          </div>
        ) : (
          <div
            class="pb-4"
            ref={
              props.index === filteredLen - 1 ? props.setLastMessage : undefined
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
