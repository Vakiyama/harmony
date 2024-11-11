import { ImageRoot, Image } from "~/components/ui/image";
// import ArrowBack from "../images/arrow-back.svg";
import HarmonyMascot from "../images/harmony-mascot-container.svg";
import HarmonyMascotAnimated from "./harmony-mascot-animated.webp";
import { createAudio } from "@solid-primitives/audio";

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
import { A, useNavigate } from "@solidjs/router";
import { twMerge } from "tailwind-merge";
import { Effect, Exit, Option, pipe } from "effect";
import { getAudio, processAudioFrame } from "~/api/voicemaker";
import { ArrayMessage } from "~/api/claude/effectGraph/messages";
import { useHarmonyChat } from "../chat/harmony-chat";
import { getUser } from "~/api/server";

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

let timeout: NodeJS.Timeout;

export default function HarmonyVoice() {
  const [counter, setCounter] = createSignal(0);
  const [streamedMessage, setStreamedMessage] = createSignal(
    "What can I help you with today?",
  );

  const [user, setUser] = createSignal<Awaited<ReturnType<typeof getUser>>>();
  const { messages, setMessages, handleConversation } = useHarmonyChat(user);

  const [audioSource, setAudioSource] = createSignal<string>();
  const [volume, ___] = createSignal(1);
  const [playing, setPlaying] = createSignal(false);
  const [audioState, __] = createAudio(audioSource, playing, volume);
  const [streaming, setStreaming] = createSignal(false);

  const [lastTranscribedMessage, setLastTranscribedMessage] = createSignal("");
  const [transcribedMessage, setTranscribedMessage] = createSignal("");

  const [micStream, setMicStream] = createSignal<
    Option.Option<MediaStreamTrack>
  >(Option.none());

  createEffect(() => {
    console.log(
      "curr time",
      audioState.currentTime,
      "duration:",
      audioState.duration,
      "console.log to cleanup with now known functionality!",
    );
    if (audioState.currentTime === audioState.duration) {
      setPlaying(false);
    }
  }, [playing, audioState]);

  async function streamMessage(message: string) {
    if (messages().length === 0) return;
    const sleepRange = { low: 10, high: 40 };
    let messageRangeCutoff = 0;
    while (true) {
      const speedFactor = messages().at(-1)!.role === "assistant" ? 2.5 : 1;

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
      if (messageRangeCutoff === message.length) break;
    }
  }

  onMount(() => {
    setInterval(() => setCounter(counter() + 1), 1000);
  });

  createEffect(() => {
    if (messages().length === 0) return;
    const messageContent = messages().at(-1)!.content;
    if (typeof messageContent !== "string") return;
    streamMessage(messageContent);
  }, [messages]);

  function base64ToBlob(base64: string, mime = "audio/mpeg") {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    const sliceSize = 512;
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  class NoAudioStream {
    readonly _tag = "NoAudioStream";
  }

  class UnexpectedAudioTrackCount {
    readonly _tag = "UnexpectedAudioTrackCount";
  }

  function streamChunksToServer(mediaStreamTrack: MediaStreamTrack) {
    if (streaming()) return;
    setStreaming(true);
    console.log("Streaming chunks to server.");
    pipe(
      mediaStreamTrack,
      (stream) => new MediaStream([stream]),
      (mediaStream) => {
        const options = { mimeType: "audio/webm;codecs=opus" };

        return new MediaRecorder(mediaStream, options);
      },
      (mediaRecorder) => {
        console.log("Media recorder event setup?");
        // create request and stream here

        mediaRecorder.ondataavailable = async (event) => {
          if (playing()) {
            return console.log("Playing, ignoring audio stream...");
          }
          // console.log("Sending chunk...");

          const base64AudioChunk = await pipe(
            event.data.arrayBuffer(),
            async (arrayBuffer) =>
              btoa(String.fromCharCode(...new Uint8Array(await arrayBuffer))),
          );

          const message = processAudioFrame({
            id: user() ? (await getUser()).id : user()!.id,
            base64AudioChunk,
            options: { languageCode: "en-US" },
          });

          setTranscribedMessage(await message);
          if (!playing() && lastTranscribedMessage() !== transcribedMessage()) {
            setStreamedMessage(await message);
          }
        };

        mediaRecorder.start(500);
      },
    );
  }

  createEffect(() => {
    if (
      lastTranscribedMessage() !== transcribedMessage() &&
      transcribedMessage() !== ""
    ) {
      console.log("Setting 3000 ms timeout");
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        setLastTranscribedMessage(transcribedMessage());
        console.log("Handling conv after 3000 sec timeout");
        await handleConversation([
          ...messages(),
          { role: "user", content: transcribedMessage() } as ArrayMessage,
        ]);
      }, 3000);
    }
  }, [transcribedMessage, lastTranscribedMessage]);

  createEffect(async () => {

      await setAudioFromMessageText("Test message!");
      setPlaying(true);

    /*
    console.log(messages(), "messages");
    if (messages().at(-1)?.role === "assistant") {
      const lastMessage = messages().at(-1)!;
      if (typeof lastMessage.content !== "string") return;
      console.log("content sent:", lastMessage.content);
      await setAudioFromMessageText(lastMessage.content);
      setPlaying(true);
    }
    */
  }, [messages]);

  function getMicStreamWithPermission() {
    pipe(
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }),
      (stream) =>
        Effect.tryPromise({
          try: () => stream,
          catch: (_) => new NoAudioStream(),
        }),
      Effect.flatMap((stream) => {
        const tracks = stream.getAudioTracks();
        if (tracks.length !== 1) {
          return Effect.fail(new UnexpectedAudioTrackCount());
        }
        return Effect.succeed(tracks[0]);
      }),
      Effect.runPromiseExit,
      async (result) =>
        Exit.match(await result, {
          onSuccess: (stream) => {
            console.log("Got audio stream!");

            if (Option.isSome(micStream())) return;
            setMicStream(Option.some(stream));

            streamChunksToServer(stream);
          },
          onFailure: console.error,
        }),
    );
  }

  onMount(async () => {
    const user = await getUser();
    setUser(user);
    getMicStreamWithPermission();
  });

  /*
    window.addEventListener("keydown", async (e: KeyboardEvent) => {
        nextMessage();
      }
    });
    */

  async function setAudioFromMessageText(text: string) {
    {
      const req = {
        VoiceId: "proplus-Aurora",
        Text: text,
      } as const;

      const audioBlob = await getAudio(req);

      if (!audioBlob) {
        return console.error("No audio blob returned from req!", req); // error
      }

      pipe(base64ToBlob(audioBlob), URL.createObjectURL, (url) => {console.log(url); return url;}, setAudioSource);
    }
  }

  return (
    <div class="flex flex-col items-center justify-between h-full pb-8 bg-gradient-to-b from-[#987CFF] to-[#C9BDF7]">
      <div class="w-full">
        <div class="flex flex-col items-center mt-10">
          <h3 class="text-xl font-grotesque text-white">
            {formatCounter(counter())}
          </h3>
          <h2 class="text-4xl mt-2 text-white">Harmony</h2>
        </div>
      </div>
      <div class="px-4 flex flex-col items-center gap-6">
        <ImageRoot
          class={twMerge(
            "mt-0 ml-4 h-[260px] w-[260px]",
            messages().at(-1)?.role === "assistant"
              ? "h-[280px] w-[280px]"
              : "",
          )}
        >
          <Image
            class="w-full"
            src={
              messages().at(-1)?.role === "assistant"
                ? HarmonyMascotAnimated
                : HarmonyMascot
            }
          />
        </ImageRoot>
        <Show when={streamedMessage().length > 0}>
          <div class={`bg-white drop-shadow-xl  rounded-[28px] px-8 py-8`}>
            <Show
              when={
                messages().at(-1)?.role === "assistant" ||
                messages().length === 0
              }
            >
              <div class="rounded-full w-4 h-4 absolute -top-6 left-14 bg-white"></div>
              <div class="rounded-full w-4 h-4 absolute -top-2 left-10 bg-white"></div>
            </Show>
            {}
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
