import { ImageRoot, Image } from "~/components/ui/image";
import { HarmonyChat } from "./harmony-chat";
import HarmonyMascot from "./images/harmony-mascot-container.svg";
import { Button } from "~/components/ui/button";
import { JSXElement } from "solid-js";
import { twMerge } from "tailwind-merge";

export default function Index() {
  return (
    <>
      <BottomModal>
        <OnboardingIntro />
      </BottomModal>
      <HarmonyChat />
    </>
  );
}

function BottomModal(props: { children: JSXElement; height?: number }) {
  return (
    <>
      <div
        class={twMerge(
          "absolute top-0 left-0 backdrop-blur bg-black/60 w-full z-10 h-screen",
        )}
      />
      <div
        class={`
        rounded-b-none
        py-5
        fixed bottom-0 w-full flex flex-col items-center z-10 bg-white h-fit border rounded-[45px]`
        }
        style={{ height: props.height ? `${props.height}px` : "fit-content" }}
      >
        {props.children}
      </div>
    </>
  );
}

function OnboardingIntro() {
  return (
    <>
      <p class="opacity-50 mt-2 text-xl">Hi, Tina</p>
      <h2 class="my-2 text-4xl">I am Harmony!</h2>
      <p class="opacity-50 text-xl">Your partner in care</p>
      <ImageRoot class="rounded-none w-60 h-60">
        <Image src={HarmonyMascot} class="w-full" />
      </ImageRoot>
      <Button
        class="bg-[#D9D9D9] mt-10 w-[calc(100%_-_40px)] rounded-full hover:bg-[#D9D9D9] h-11" // fix this
        size="lg"
      >
        <span class="text-black">Next</span>
      </Button>
    </>
  );
}
