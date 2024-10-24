import { Show, createEffect, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Message } from "~/api/claude/apiCalls";
import { Image, ImageRoot } from "~/components/ui/image";
import Tail from "../images/Tail.svg";
import HarmonyMascot from "../images/harmony-mascot-container.svg";
import Soundwave from "../images/BsSoundwave.svg";
import { harmonyChat } from "~/api/claude/chat";
import SolidMarkdown from "@zentered/solid-markdown";
import "./markdown.css";
import { A } from "@solidjs/router";

export function HarmonyChat() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [input, setInput] = createSignal<string>("");
  const [lastMessage, setLastMessage] = createSignal<HTMLDivElement>();

  async function handleConversation(messages: Message[]) {
    const response = await harmonyChat(messages);
    const newMessages = [
      ...messages,
      { role: "assistant", content: response.content[0].text } as const,
    ];
    setMessages(newMessages);
  }

  createEffect(() => {
    console.log(lastMessage());
    if (lastMessage() === undefined) return;
    console.log("scrolling!");
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
    setMessages(newMessages);
    setInput("");

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
                  <div class="flex flex-col items-center">
                    <ImageRoot class="rounded-none w-60 h-60">
                      <Image src={HarmonyMascot} class="w-full" />
                    </ImageRoot>
                    <h2 class="text-4xl my-1">
                      Good {currentTimeOfDay}, Tina!
                    </h2>
                    <h3 class="opacity-50">What can I help with today?</h3>
                  </div>
                </div>
              </Show>
            }
          >
            {messages().map((message, index) => (
              <div
                class={twMerge(
                  "flex items-center relative max-w-[90%]",
                  message.role === "user"
                    ? "self-end flex-row-reverse mr-1 "
                    : "self-start flex-row",
                )}
              >
                <div
                  class={twMerge(
                    "rounded-xl p-2 my-3 mx-1 w-fit text-gray-800 px-4",
                    message.role === "user"
                      ? "rounded-br-none bg-[#937AEE]"
                      : "",
                  )}
                >
                  {message.role === "user" ? (
                    <p class="text-white">{message.content}</p>
                  ) : (
                    <div
                      class="pb-4"
                      ref={
                        index === messages().length - 1
                          ? setLastMessage
                          : undefined
                      }
                    >
                      <SolidMarkdown
                        class="markdown"
                        children={message.content}
                      />
                    </div>
                  )}
                </div>
                <Show when={message.role === "user"}>
                  <div
                    class={twMerge(
                      "absolute bottom-[24px] w-2 h-2 right-[2px]",
                    )}
                  >
                    <ImageRoot class="w-full">
                      <Image src={Tail} alt="" class="relative bottom-px" />
                    </ImageRoot>
                  </div>
                </Show>
              </div>
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
