import { Button } from "~/components/ui/button";
import HarmonyMascot from "../../images/harmony-mascot-container.svg";
import { Image, ImageRoot } from "~/components/ui/image";
import { createEffect, createSignal, onMount } from "solid-js";
import { User } from "@/schema/Users";
import { twMerge } from "tailwind-merge";
import { DragGesture } from "@use-gesture/vanilla";
import { updateUser } from "~/api/server";
import { redirect } from "@solidjs/router";

type Voice = (typeof voicesMap)[number];

const voicesMap = [
  {
    id: "proplus-Lily",
    display: "Lily",
    description: "Casual and conversational",
  },
  { id: "proplus-Aurora", display: "Aurora", description: "Calm and relaxed" },
  { id: "proplus-Lucas", display: "Lucas", description: "Casual and engaging" },
] as const;

export function OnboardingIntro(props: { user: User; fetchUser: () => void }) {
  const [pageIndex, setPageIndex] = createSignal(0);
  const [selectedVoice, setSelectedVoice] = createSignal<Voice>(voicesMap[0]);
  const [preference, setPreference] = createSignal<"Text" | "Voice" | null>(
    "Text",
  );

  async function completeOnboarding() {
    await updateUser({
      aiPreference: preference(),
      chosenVoice: selectedVoice().id,
    });
    props.fetchUser();
  }

  return (
    <>
      {pageIndex() === 0 && (
        <PageOne setPageIndex={setPageIndex} user={props.user} />
      )}
      {pageIndex() === 1 && (
        <PageTwo
          setPageIndex={setPageIndex}
          setSelectedVoice={setSelectedVoice}
          currentVoice={selectedVoice()}
        />
      )}
      {pageIndex() === 2 && (
        <PageThree
          setPageIndex={setPageIndex}
          setPreference={setPreference}
          pref={preference()}
          completeOnboarding={completeOnboarding}
        />
      )}
    </>
  );
}

function PageThree(props: {
  setPageIndex: (index: number) => void;
  setPreference: (pref: "Text" | "Voice") => void;
  pref: "Text" | "Voice" | null;
  completeOnboarding: () => void;
}) {
  return (
    <>
      <h2 class="my-2 text-4xl">AI Preferences</h2>
      <p class="opacity-50 text-lg mx-8 text-center">
        Let us know how you prefer to chat with Harmony - Voice or chatbox!
      </p>
      <div class="flex flex-col w-full gap-3 px-4 my-8">
        {(["Text", "Voice"] as const).map((type) => (
          <Button
            class={twMerge(
              "w-full bg-gray-200 text-black/70 h-[5rem] text-xl",
              props.pref === type ? "bg-primary-purple-300" : "",
            )}
            onClick={() => props.setPreference(type)}
          >
            {type}
          </Button>
        ))}
      </div>
      <Button
        class="bg-primary-purple-300 mt-10 w-[calc(100%_-_40px)] rounded-full hover:bg-primary-purple-400 h-11"
        size="lg"
        onClick={() => {
          props.completeOnboarding();
        }}
      >
        <span class="text-black">Next</span>
      </Button>
      {/*<p>Skip for now</p>*/}
    </>
  );
}

function PageTwo(props: {
  setPageIndex: (index: number) => void;
  setSelectedVoice: (voice: (typeof voicesMap)[number]) => void;
  currentVoice: Voice;
}) {
  const [dragging, setDragging] = createSignal(false);
  const [swipeRef, setSwipeRef] = createSignal<HTMLDivElement | null>();
  const [transformX, setTransformX] = createSignal(0);
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const buffer = 0.25; // Buffer multiplier (e.g., 25% of the item width)
  let initialTransformX = 0;

  const sharedClass = "w-10 bg-primary-purple-500 rounded-full";

  createEffect(() => {
    const ref = swipeRef();
    if (!ref) return;

    new DragGesture(ref, (event) => {
      const itemWidth = ref.getBoundingClientRect().width;

      if (event.first) {
        initialTransformX = transformX();
      }

      if (event.active) {
        setDragging(true);
        setTransformX((prev) => {
          return Math.min(
            Math.max(0, prev - event.delta[0]),
            itemWidth * (voicesMap.length - 1),
          );
        });
      }

      if (event.last) {
        setDragging(false);
        const deltaX = transformX() - initialTransformX;

        if (
          deltaX > buffer * itemWidth &&
          currentIndex() < voicesMap.length - 1
        ) {
          // Swiped left enough, move to next item
          setCurrentIndex(currentIndex() + 1);
        } else if (deltaX < -buffer * itemWidth && currentIndex() > 0) {
          // Swiped right enough, move to previous item
          setCurrentIndex(currentIndex() - 1);
        }
        // Update the transformX to snap to the item
        const newTransformX = itemWidth * currentIndex();
        setTransformX(newTransformX);
        props.setSelectedVoice(voicesMap[currentIndex()]);
      }
    });
  }, [swipeRef]);

  onMount(() => {
    window.addEventListener("resize", () => {
      setDragging(true);
      const ref = swipeRef();
      if (!ref) return;
      const itemWidth = ref.getBoundingClientRect().width;
      if (!itemWidth) return;
      const newTransformX = itemWidth * currentIndex();
      setTransformX(newTransformX);
      setDragging(false);
    });
  });

  return (
    <>
      <h2 class="my-2 text-4xl text-center">Choose a voice for Harmony!</h2>
      <div
        class="flex flex-row touch-none justify-start w-screen"
        id="swipable-voice"
        ref={setSwipeRef}
      >
        {voicesMap.map((voice) => (
          <div
            class={twMerge(
              "flex flex-col items-center justify-center",
              dragging() ? "transition-none" : "transition-transform",
            )}
            style={{
              transform: `translateX(-${transformX()}px)`,
            }}
          >
            <div class="rounded-none flex flex-row gap-0.5 items-center my-8 transition-transform w-screen justify-center">
              <div class={twMerge(sharedClass, "h-12")} />
              <div
                class={twMerge(sharedClass, "h-24 animate-sound-wave delay-0")}
              />
              <div
                class={twMerge(
                  sharedClass,
                  "h-32 animate-sound-wave [animation-delay:_-150ms]",
                )}
              />
              <div
                class={twMerge(
                  sharedClass,
                  "h-24 animate-sound-wave [animation-delay:_-300ms]",
                )}
              />
              <div class={twMerge(sharedClass, "h-12")} />
            </div>
            <div class="my-4 text-center">
              <h3 class="text-3xl">{voice.display}</h3>
              <p class="text-black/75 text-xl">{voice.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div class="flex flex-row items-center justify-center gap-2">
        {voicesMap.map((voice, index) => (
          <div
            class={twMerge(
              "h-4 w-4 rounded-full bg-black/15",
              index === currentIndex() ? "bg-primary-purple-500" : "",
            )}
          />
        ))}
      </div>
      <Button
        class="bg-primary-purple-300 mt-10 w-[calc(100%_-_40px)] rounded-full hover:bg-primary-purple-400 h-11"
        size="lg"
        onClick={() => props.setPageIndex(2)}
      >
        <span class="text-black">Next</span>
      </Button>
    </>
  );
}

function PageOne(props: { setPageIndex: (index: number) => void; user: User }) {
  return (
    <>
      <p class="opacity-50 mt-2 text-xl">Hi, {props.user.firstName}</p>
      <h2 class="my-2 text-4xl">I am Harmony!</h2>
      <p class="opacity-50 text-xl">Your partner in care</p>
      <ImageRoot class="rounded-none w-60 h-60">
        <Image src={HarmonyMascot} class="w-full" />
      </ImageRoot>
      <Button
        class="bg-primary-purple-300 mt-10 w-[calc(100%_-_40px)] rounded-full hover:bg-primary-purple-400 h-11"
        size="lg"
        onClick={() => {
          props.setPageIndex(1);
        }}
      >
        <span class="text-black">Next</span>
      </Button>
    </>
  );
}
