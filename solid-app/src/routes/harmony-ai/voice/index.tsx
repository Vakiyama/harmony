import { ImageRoot, Image } from "~/components/ui/image";
import ArrowBack from "../images/arrow-back.svg";
import HarmonyMascot from "../images/harmony-mascot-container.svg";

import Speaker from "../images/Speaker.svg";
import EndCall from "../images/end.svg";
import Mute from "../images/BsMicMuteFill.svg";
import {
  createEffect,
  createMemo,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import { A } from "@solidjs/router";

function toTwoDigits(value: number): string {
  return value.toString().length === 1 ? `0${value}` : `${value}`;
}

function formatCounter(seconds: number) {
  if (seconds / 60 > 0) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = seconds - Math.floor(seconds / 60) * 60;
    return `${toTwoDigits(minutes)}:${toTwoDigits(secondsRemainder)}`;
  } else return `00:${toTwoDigits(seconds)}`;
}

function sleep(ms: number) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, ms),
  );
}

const demoConversation = [
  {
    type: "user",
    message:
      "Hi Harmony, please create a new calendar event for Grandma's doctor's appointment tomorrow at 10:30 am.",
  },
  {
    type: "assistant",
    message: "Certainly! What's the location of the appointment?",
  },
  {
    type: "user",
    message: "555 Seymour St, Vancouver.",
  },
  {
    type: "assistant",
    message: "Thank you. When does the appointment end?",
  },
  {
    type: "user",
    message: "At 10:50 am.",
  },
  {
    type: "assistant",
    message: "Does this appointment repeat?",
  },
  {
    type: "user",
    message: "No, it's a one-time appointment.",
  },
  {
    type: "assistant",
    message: "Understood. Who will be taking Grandma to the appointment?",
  },
  {
    type: "user",
    message: "Tina.",
  },
  {
    type: "assistant",
    message: "Great. Would you like to add any notes to the event?",
  },
  {
    type: "user",
    message:
      "Yes, please add a note to ask the doctor to renew Grandma's medications.",
  },
  {
    type: "assistant",
    message:
      "All set! I've added the event to Grandma's calendar for tomorrow from 10:30 am to 10:50 am at 555 Seymour St, Vancouver. Tina will be taking her, and I've included a note to ask the doctor to renew her medications.",
  },
] as const;

export default function HarmonyVoice() {
  const [counter, setCounter] = createSignal(0);
  const [streamedMessage, setStreamedMessage] = createSignal(
    "What can I help you with today?",
  );
  const [messageIndex, setMessageIndex] = createSignal(-1);

  const message = createMemo(
    () =>
      messageIndex() === -1
        ? { message: "", type: "assistant" } as const
        : demoConversation[messageIndex()],
    [messageIndex],
  );


  async function streamMessage(message: string) {
    console.log("streamMessage");
    const sleepRange = { low: 30, high: 80 };
    let messageRangeCutoff = 0;
    while (true) {
      const speedFactor =
        demoConversation[messageIndex()].type === "assistant" ? 2.5 : 1;
      await sleep(
        (sleepRange.low + Math.floor(sleepRange.high * Math.random())) /
          speedFactor,
      );
      messageRangeCutoff++;
      const clippedMessage = message
        .split("")
        .reverse()
        .slice(message.length - messageRangeCutoff)
        .reverse()
        .join("");
      setStreamedMessage(clippedMessage);
      console.log("setting msg:", clippedMessage);
      if (messageRangeCutoff === message.length) break;
    }
  }

  onMount(() => {
    setInterval(() => setCounter(counter() + 1), 1000);
  });

  function nextMessage() {
    setMessageIndex((prevIndex) =>
      prevIndex < demoConversation.length - 1 ? prevIndex + 1 : prevIndex,
    );
  }

  createEffect(() => {
    if (messageIndex() === -1) return;
    streamMessage(message().message);
  }, [message]);

  onMount(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "p") {
        nextMessage();
      }
    });
  });

  return (
    <div class="flex flex-col items-center justify-between h-full pb-8 bg-gradient-to-b from-[#987CFF]">
      <div class="w-full">
        <div class="flex flex-col items-center mt-6">
          <h3 class="text-xl font-grotesque text-black/70">
            {formatCounter(counter())}
          </h3>
          <h2 class="text-4xl mt-2">Harmony</h2>
          <ImageRoot class="mt-0 ml-4 h-[200px] w-[200px]">
            <Image class="w-full" src={HarmonyMascot} />
          </ImageRoot>
        </div>
      </div>
      <div class="px-4">
        <Show when={streamedMessage().length > 0}>
          <div class={`bg-white drop-shadow-lg rounded-lg px-4 py-4`}>
            <p>{streamedMessage()}</p>
          </div>
        </Show>
      </div>
      <div class="flex flex-row w-[90%] justify-between items-center">
        <div class="flex flex-col items-center gap-2">
          <div class="rounded-full bg-[#1E1E1E]/15 w-16 h-16 flex items-center justify-center">
            <ImageRoot class="p-0.5">
              <Image class="w-full" src={Speaker} />
            </ImageRoot>
          </div>
          <p>Speaker</p>
        </div>
        <A href="/harmony-ai/chat">
          <div class="flex flex-col items-center gap-2">
            <div class="rounded-full bg-[#FE463C] w-20 h-20 flex items-center justify-center">
              <ImageRoot class="">
                <Image class="w-full" src={EndCall} />
              </ImageRoot>
            </div>
            <p>End</p>
          </div>
        </A>
        <div class="flex flex-col items-center gap-2">
          <div class="rounded-full bg-[#1E1E1E]/15 w-16 h-16 flex items-center justify-center">
            <ImageRoot class="p-1">
              <Image class="w-full" src={Mute} />
            </ImageRoot>
          </div>
          <p>Mute</p>
        </div>
      </div>
    </div>
  );
}
