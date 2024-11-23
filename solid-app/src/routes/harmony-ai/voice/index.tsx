import HarmonyMascotAnimated from "./harmony-mascot-animated.webp";
import HarmonyMascot from "../images/harmony-mascot.svg";
import { createAudio } from "@solid-primitives/audio";
import { io, Socket } from "socket.io-client";
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
import { ImageRoot, Image } from "~/components/ui/image";
import { DefaultEventsMap } from "socket.io";

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
  const [loudness, setLoudness] = createSignal(0);

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
    console.log(audioState.currentTime, audioState.duration);
    if (
      audioState.currentTime >= audioState.duration &&
      playing() &&
      audioState.currentTime !== 0
    ) {
      console.log("Setting playing to false!");
      setPlaying(false);
    }
  }, [playing, audioState, audioState.currentTime]);

  let currentStreamingToken: any = null;

  async function streamMessage(message: string) {
    // Cancel previous streaming if any
    if (currentStreamingToken) {
      currentStreamingToken.cancelled = true;
    }
    const streamingToken = { cancelled: false };
    currentStreamingToken = streamingToken;

    const sleepRange = { low: 10, high: 40 };
    let messageRangeCutoff = 0;
    while (!streamingToken.cancelled) {
      const speedFactor = messages().at(-1)?.role === "assistant" ? 2.5 : 1;

      await sleep(
        (sleepRange.low + Math.floor(sleepRange.high * Math.random())) /
          speedFactor,
      );

      messageRangeCutoff++;
      const clippedMessage = message.slice(0, messageRangeCutoff);
      setStreamedMessage(clippedMessage);
      setCurrentStreamedRole("assitant");
      if (messageRangeCutoff >= message.length) break;
    }
  }

  createEffect(() => {
    if (messages().length === 0) return;
    const messageContent = messages().at(-1)!.content;
    if (typeof messageContent !== "string") return;
    streamMessage(messageContent);
  });

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
      (stream) => {
        const audioContext = new AudioContext();

        // Create a MediaStreamSource from the MediaStream
        const source = audioContext.createMediaStreamSource(stream);

        // Create an AnalyserNode
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // Adjust as needed

        // Connect the source to the analyser
        source.connect(analyser);

        function updateLoudness() {
          // Function to compute loudness and update animations
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);

          // Compute the RMS amplitude
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            const normalizedValue = dataArray[i] / 128 - 1; // Normalize to [-1, 1]
            sum += normalizedValue * normalizedValue;
          }
          const rms = Math.sqrt(sum / bufferLength); // RMS value between 0 and 1

          setLoudness(muted() || playing() ? 0 : rms);
        }
        setInterval(() => {
          updateLoudness();
        }, 100);

        return stream;
      },
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
          if (message === "") return;
          if (playing())
            return console.log("Receiving, ignoring because playing.");
          setTranscribedMessage(message);
          if (!playing() && lastTranscribedMessage() !== transcribedMessage()) {
            setStreamedMessage(message);
            setCurrentStreamedRole("user");
          }
        });

        let isHandlingConversation = false;

        socket.on("end-utterance", () => {
          if (playing() || isHandlingConversation || 
            (currentStreamedRole() === "assitant" && messages.length !== 0)
            ) return;
          isHandlingConversation = true;
          setPlaying(true);
          setLastTranscribedMessage(transcribedMessage());
          socket.emit("end-transcription");
          handleConversation([
            ...messages(),
            { role: "user", content: transcribedMessage() },
          ]).finally(() => {
            isHandlingConversation = false;
          });
        });

        mediaRecorder.onstop = () => {
          mediaStreamTrack.stop();
        };
        mediaRecorder.ondataavailable = async (event) => {
          if (
            playing() ||
            muted() ||
            isHandlingConversation ||
            (currentStreamedRole() === "assitant" && messages.length !== 0)
          ) {
            return;
          }
          console.log("Sending data...");
          socket.emit("write-transcription", {
            dataBlob: event.data,
          });
        };

        mediaRecorder.start(100);
        setRecorder(mediaRecorder);
      },
    );
  }

  createEffect(async () => {
    console.log(messages(), "messages");
    if (messages().at(-1)?.role === "assistant") {
      const lastMessage = messages().at(-1)!;
      if (typeof lastMessage.content !== "string") return;
      console.log("content sent:", lastMessage.content);
      await setAudioFromMessageText(lastMessage.content);
      console.log("Audio set, playing!");
      setPlaying(true);

      socket.emit("start-transcription");
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

  function handleCleanup() {
    if (!user()) return;
    const recorderSignal = recorder();
    if (recorderSignal) {
      console.log("Attempting to turn off recorder signal.");
      recorderSignal.stop();
      setRecorder(undefined);
    }
    // socket?.disconnect();
  }

  onCleanup(handleCleanup);

  onMount(async () => {
    setInterval(() => setCounter(counter() + 1), 1000);
    const user = await getUser();
    setUser(user);
    setPlaying(false);
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
          <div class="flex flex-row bg-black/15 rounded-full px-4 gap-0.5 h-6 items-center mt-2">
            {Array(7)
              .fill(null)
              .map((_) => (
                <div
                  class="bg-white w-1 h-1 rounded-full transition-all max-h-4 "
                  style={{
                    height: `${4 + loudness() * 200 * Math.random()}px`,
                  }}
                />
              ))}
          </div>
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
          <Image class="w-full" src={HarmonyMascotAnimated} />
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
        <A onClick={handleCleanup} href="/harmony-ai/chat">
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
              setMuted((muted) => {
                const newMuted = !muted;

                socket.emit(
                  newMuted ? "end-transcription" : "start-transcription",
                );

                return newMuted;
              });
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
