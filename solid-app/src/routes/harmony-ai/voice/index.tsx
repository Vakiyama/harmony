import { ImageRoot, Image } from "~/components/ui/image";
import HarmonyMascot from "../images/harmony-mascot-container.svg";
import HarmonyMascotAnimated from "./harmony-mascot-animated.webp";
import { createAudio } from "@solid-primitives/audio";
import { clientSocket as socket } from "~/lib/clientSocket";

import Speaker from "../images/Speaker.svg";
import EndCall from "../images/end.svg";
import Mute from "../images/BsMicMuteFill.svg";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { twMerge } from "tailwind-merge";
import { Effect, Exit, pipe } from "effect";
import { ArrayMessage } from "~/api/claude/effectGraph/messages";
import { useHarmonyChat } from "../chat/harmony-chat";
import { getUser } from "~/api/server";
import { InferSelectModel } from "drizzle-orm";
import { users } from "@/schema/Users";

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

  const [currentStreamedRole, setCurrentStreamedRole] = createSignal<
    "assitant" | "user"
  >("assitant");

  const [user, setUser] = createSignal<Awaited<ReturnType<typeof getUser>>>();
  const {
    messages,
    setMessages: _,
    handleConversation, //@ts-ignore ?????? :((((((
  } = useHarmonyChat(user, true);

  const [audioSource, setAudioSource] = createSignal<string>();
  const [volume, ___] = createSignal(1);
  const [playing, setPlaying] = createSignal(false);
  const [audioState, __] = createAudio(audioSource, playing, volume);

  const [lastTranscribedMessage, setLastTranscribedMessage] = createSignal("");
  const [transcribedMessage, setTranscribedMessage] = createSignal("");
  const [recorder, setRecorder] = createSignal<MediaRecorder>();
  const [muted, setMuted] = createSignal(false);

  createEffect(() => {
    if (audioState.currentTime >= audioState.duration) {
      console.log("Setting playing to false!");
      setTimeout(() => {
        setPlaying(false);
      }, 3000);
    }
  }, [playing, audioState, audioState.currentTime]);

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
      setCurrentStreamedRole("assitant");
      if (messageRangeCutoff === message.length) break;
    }
  }

  createEffect(() => {
    if (messages().length === 0) return;
    const messageContent = messages().at(-1)!.content;
    if (typeof messageContent !== "string") return;
    streamMessage(messageContent);
  }, [messages]);

  class NoAudioStream {
    readonly _tag = "NoAudioStream";
  }

  class UnexpectedAudioTrackCount {
    readonly _tag = "UnexpectedAudioTrackCount";
  }

  function streamChunksToServer(mediaStreamTrack: MediaStreamTrack) {
    console.log("Streaming chunks to server.");
    pipe(
      mediaStreamTrack,
      (stream) => new MediaStream([stream]),
      (mediaStream) => {
        const recorder = new MediaRecorder(mediaStream, {
          mimeType: "audio/webm;codecs=opus",
          audioBitsPerSecond: 16000,
        });
        console.log(recorder.audioBitsPerSecond);
        return recorder;
      },
      (mediaRecorder) => {
        // create request and stream here

        socket.emit("start-transcription");

        socket.on("transcription-results", (message) => {
          if (playing())
            return console.log("Recieving, ignoring because playing.");
          setTranscribedMessage(message);
          if (!playing() && lastTranscribedMessage() !== transcribedMessage()) {
            setStreamedMessage(message);
            setCurrentStreamedRole("user");
          }
        });

        mediaRecorder.ondataavailable = async (event) => {
          if (playing() || muted()) {
            // LOL DON'T LOOK PLEASE DONT EVEN ASK
            if (Math.random() > 0.15) return;
          }
          const base64AudioChunk = await pipe(
            event.data.arrayBuffer(),
            async (arrayBuffer) =>
              btoa(String.fromCharCode(...new Uint8Array(await arrayBuffer))),
          );

          socket.emit("write-transcription", {
            base64AudioChunk,
          });
        };

        mediaRecorder.start(50);
        setRecorder(mediaRecorder);
      },
    );
  }

  createEffect(() => {
    if (
      lastTranscribedMessage() !== transcribedMessage() &&
      transcribedMessage() !== ""
    ) {
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
    console.log(messages(), "messages");
    if (messages().at(-1)?.role === "assistant") {
      const lastMessage = messages().at(-1)!;
      if (typeof lastMessage.content !== "string") return;
      console.log("content sent:", lastMessage.content);
      await setAudioFromMessageText(lastMessage.content);
      console.log("Audio set, playing!");

      socket.emit("end-transcription");
      setPlaying(true);
    }
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
      async (result) => {
        return Exit.match(await result, {
          onSuccess: (stream) => {
            console.log("Got audio stream!");
            streamChunksToServer(stream);
          },
          onFailure: console.error,
        });
      },
    );
  }

  onCleanup(() => {
    if (!user()) return;
    socket.emit("end-transcription");
    if (recorder()) {
      recorder()!.pause;
    }
  });

  onMount(async () => {
    setInterval(() => setCounter(counter() + 1), 1000);
    const user = await getUser();
    setUser(user);

    if (recorder()) recorder()?.start();
    else getMicStreamWithPermission();
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
        VoiceId: (user() as InferSelectModel<typeof users>).chosenVoice
          ? (user() as InferSelectModel<typeof users>).chosenVoice
          : "proplus-Lily",
        Text: text,
        turbo: "turbo",
      } as const;

      const response = await fetch("/voicemaker/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      const blob = await response.blob();

      pipe(
        blob,
        URL.createObjectURL,
        (url) => {
          console.log(url);
          return url;
        },
        setAudioSource,
      );
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
              messages().at(-1)?.role === "assistant" || !playing()
                ? HarmonyMascotAnimated
                : HarmonyMascot
            }
          />
        </ImageRoot>
        <Show when={streamedMessage().length > 0}>
          <div class={`bg-white drop-shadow-xl  rounded-[28px] px-8 py-8`}>
            <Show when={currentStreamedRole() === "assitant"}>
              <div class="rounded-full w-4 h-4 absolute -top-6 left-14 bg-white"></div>
              <div class="rounded-full w-4 h-4 absolute -top-2 left-10 bg-white"></div>
            </Show>
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
          <div
            class={twMerge(
              "rounded-full bg-[#1E1E1E]/15 w-16 h-16 flex items-center justify-center",
              muted() ? "border-2 border-red-500" : "",
            )}
            onClick={() => {
              setMuted((muted) => !muted);
            }}
          >
            <ImageRoot class="p-1 ">
              <Image class="w-full" src={Mute} />
            </ImageRoot>
          </div>
          <p>Mute</p>
        </div>
      </div>
    </div>
  );
}
