import { ImageRoot, Image } from "~/components/ui/image";
import ArrowBack from "../images/arrow-back.svg";
import HarmonyMascot from "../images/harmony-mascot-container.svg";

import Speaker from "../images/Speaker.svg";
import EndCall from "../images/end.svg";
import Mute from "../images/BsMicMuteFill.svg";
import { createSignal, onMount } from "solid-js";
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

export default function HarmonyVoice() {
  const [counter, setCounter] = createSignal(0);
  const [messageIndex, setMessageIndex] = createSignal(0);

  const demoConversation = [
    {
      type: "user",
      message:
        "Hi Harmony, please create a new calendar event for Grandma's doctor's appointment tomorrow at 10:30 am",
    },
    {
      type: "assistant",
      message: "What is the location of the doctor's appointment?",
    },
    {
      type: "user",
      message: "555 Seymour St, Vancouver, BC V6B 3H6",
    },
    {
      type: "assistant",
      message: "What is the approximate end time for the appointment?",
    },
    {
      type: "user",
      message: "10:50 am",
    },
    {
      type: "assistant",
      message: "Does the appointment repeat?",
    },
    {
      type: "user",
      message: "No",
    },
    {
      type: "assistant",
      message:
        "Who will be taking Grandma to her doctor's appointment tomorrow?",
    },
    {
      type: "user",
      message: "Tina",
    },
    {
      type: "assistant",
      message:
        "Are there any notes you would like to make for this appointment?",
    },
    {
      type: "user",
      message: "Ask doctor to renew Grandma's meds",
    },
    {
      type: "assistant",
      message:
        "I have created a new event in Lola's calendar for a doctor's appointment tomorrow at 10:30-10:50am at 555 Seymour St, Vancouver, BC V6B 3H6 that Tina will take her too with a note to ask the doctor to renew Lola's meds",
    },
  ];

  onMount(() => {
    setInterval(() => setCounter(counter() + 1), 1000);
  });

  function nextMessage() {
    setMessageIndex((prevIndex) =>
      prevIndex < demoConversation.length - 1 ? prevIndex + 1 : prevIndex
    );
  }

  const currentMessage = () => {
    demoConversation[messageIndex()];
  };

  return (
    <div class="flex flex-col items-center justify-between h-full pb-8 border">
      <div class="w-full">
        <A href="/harmony-ai/chat">
          <ImageRoot class="mt-5 ml-4">
            <Image class="h-7" src={ArrowBack} />
          </ImageRoot>
        </A>
        <div class="flex flex-col items-center">
          <h3 class="opacity-50 text-xl font-grotesque">
            {formatCounter(counter())}
          </h3>
          <h2 class="text-4xl mt-2">Harmony</h2>
        </div>
      </div>
      <ImageRoot class="mt-0 ml-4 h-[60%] w-[60%]">
        <Image class="w-full border" src={HarmonyMascot} />
      </ImageRoot>
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
