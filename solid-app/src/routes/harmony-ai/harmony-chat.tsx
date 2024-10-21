import { Show, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Message } from "~/api/claude/apiCalls";
import { Image, ImageRoot } from "~/components/ui/image";
import Tail from "./images/Tail.svg";
import Soundwave from "./images/BsSoundwave.svg";
import { harmonyChat } from "~/api/claude/chat";
import SolidMarkdown from "@zentered/solid-markdown";
import "./markdown.css";

export function HarmonyChat() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [input, setInput] = createSignal<string>("");

  async function handleConversation(messages: Message[]) {
    const response = await harmonyChat(messages);
    const newMessages = [
      ...messages,
      { role: "assistant", content: response.content[0].text } as const,
    ];
    setMessages(newMessages);
  }

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

  return (
    <div class="bg-[#E0E0E0] h-full relative overflow-hidden">
      <form onSubmit={handleSubmit} class="h-full">
        <div class="flex flex-col overflow-scroll h-[calc(100%_-_65px)]">
          {[
            { role: "assistant", content: "What can I help you with today?" },
            ...messages(),
          ].map((message) => (
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
                  "rounded-md p-2 my-3 mx-1 w-fit text-gray-800",
                  message.role === "user" ? "rounded-br-none bg-white" : "",
                )}
              >
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <SolidMarkdown class="markdown" children={message.content} />
                )}
              </div>
              <Show when={message.role === "user"}>
                <div
                  class={twMerge("absolute bottom-[24px] w-2 h-2 right-[2px]")}
                >
                  <ImageRoot class="w-full">
                    <Image src={Tail} alt="" class="relative bottom-px" />
                  </ImageRoot>
                </div>
              </Show>
            </div>
          ))}
        </div>
        <div class="flex flex-row px-2 gap-1 border-t-gray-600 border-t pt-2 pb-4">
          <input
            class="w-full rounded-full px-3 py-0 border border-gray-400 text-sm"
            value={input()}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Harmony..."
          />
          <button class="rounded-full p-px border bg-white flex items-center justify-center">
            <ImageRoot class="h-7 w-7 flex items-center justify-center">
              <Image height="20px" width="20px" src={Soundwave} class="h-5" />
            </ImageRoot>
          </button>
        </div>
      </form>
    </div>
  );
}
