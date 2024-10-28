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

  onMount(() => {
    setInterval(() => setCounter(counter() + 1), 1000);
  });

  return (
    <div class="flex flex-col items-center justify-between h-full pb-8 border">
      <div class="w-full">
        <A href="/harmony-ai/chat">
          <ImageRoot class="mt-16 ml-4">
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
      <ImageRoot class="mt-0 ml-4 h-[350px] w-[350px]">
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
