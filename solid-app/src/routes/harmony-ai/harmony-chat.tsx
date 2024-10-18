import { Show, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Message } from "~/api/claude/apiCalls";
import { Image, ImageRoot } from "~/components/ui/image";
import Tail from "./images/Tail.svg";
import Soundwave from "./images/BsSoundwave.svg";

const sampleMessages: Message[] = [
  {
    role: "user",
    content: "Hello, how are you?",
  },
  {
    role: "assistant",
    content: "I’m doing well, thank you! How can I assist you today?",
  },
  {
    role: "user",
    content: "Can you help me with a TypeScript question?",
  },
  {
    role: "assistant",
    content: "Of course! What do you need help with?",
  },
  {
    role: "user",
    content: "I’m working on a project and need to generate some sample data.",
  },
  {
    role: "assistant",
    content:
      "Sure, I can create sample data for you. What type are you working with?",
  },
  {
    role: "user",
    content:
      "I have a type for messages that alternate between user and assistant.",
  },
  {
    role: "assistant",
    content:
      "Great! I can help with that. Let me know if you need anything else!",
  },
];

export function HarmonyChat() {
  // need:
  // an input field
  // text bubbles
  // some basic styling; color inputs, we can do this later tho

  const [messages, setMessages] = createSignal<Message[]>(sampleMessages);
  const [input, setInput] = createSignal<string>("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    setMessages((messages) => {
      messages.push({
        role: "user",
        content: input(),
      });

      return messages;
    });

    setInput("");
    // add user message
    // send to claude
    // get response
    // update messages
  }

  return (
    <div class="max-w-[700px] mx-4 border bg-[#E0E0E0]">
      <form onSubmit={handleSubmit}>
        <div class="flex flex-col ">
          {messages().map((message) => (
            <div
              class={twMerge(
                "flex items-center relative",
                message.role === "user"
                  ? "self-end flex-row-reverse"
                  : "self-start flex-row",
              )}
            >
              <div
                class={twMerge(
                  "rounded-md p-2 my-3 mx-1 w-fit text-gray-800 ",
                  message.role === "user" ? "rounded-br-none bg-white" : "",
                )}
              >
                <p>{message.content}</p>
              </div>
              <Show when={message.role === "user"}>
                <div
                  class={twMerge("absolute bottom-[24px] w-2 h-2 right-[2px]")}
                >
                  <ImageRoot class="w-full">
                    <Image src={Tail} alt="" class="" />
                  </ImageRoot>
                </div>
              </Show>
            </div>
          ))}
        </div>
        <div class="flex flex-row px-4 gap-2 border-t-gray-300 border-t pt-2 pb-4">
          <input
            class="w-full rounded-full px-4 py-0 border border-gray-500"
            value={input()}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Harmony..."
          />
          <button class="rounded-full p-1 border bg-white flex items-center justify-center">
            <ImageRoot>
              <Image src={Soundwave} class="p-1.5" />
            </ImageRoot>
          </button>
        </div>
      </form>
    </div>
  );
}
