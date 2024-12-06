import HarmonyMascotAnimated from "./harmony-mascot-animated.webp";
import HarmonyMascot from "../images/harmony-mascot.svg";
import { createAudio } from "@solid-primitives/audio";
import { io, Socket } from "socket.io-client";
import { clientSocket as socket } from "~/lib/clientSocket";

import Speaker from "../images/Speaker.svg";
import EndCall from "../images/end.svg";
import Mute from "../images/BsMicMuteFill.svg";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { twMerge } from "tailwind-merge";
import { Effect, Exit, pipe } from "effect";
import { demoConversation, useHarmonyChat } from "../chat/harmony-chat";
import { getUser } from "~/api/server";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "@/schema/Users";
import { ImageRoot, Image } from "~/components/ui/image";
import { db } from "~/api/db";
import { events } from "../../../../drizzle/schema/Events";
import { demoHelper, getCalendarFromTeamId } from "~/api/calendar";
import { eventParticipants } from "@/schema/EventParticipants";
import { getListOfTeams } from "~/api/team";

import { useTeam } from "~/context/team-context";

function sleep(ms: number) {
  return new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, ms),
  );
}

export default function HarmonyVoice() {
  const [streamedMessage, setStreamedMessage] = createSignal(
    "What can I help you with today?",
  );
  const [loudness, setLoudness] = createSignal(0);
  const [demoIndex, setDemoIndex] = createSignal(-1);

  const [currentStreamedRole, setCurrentStreamedRole] = createSignal<
    "assistant" | "user"
  >("assistant");

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

  const [lastAudioDuration, setLastAudioDuration] = createSignal(0);
  const [lastTranscribedMessage, setLastTranscribedMessage] = createSignal("");
  const [transcribedMessage, setTranscribedMessage] = createSignal("");
  const [recorder, setRecorder] = createSignal<MediaRecorder>();
  const [muted, setMuted] = createSignal(false);

  const teams = useTeam();

  createEffect(() => {
    if (
      audioState.currentTime >= audioState.duration &&
      playing() &&
      audioState.currentTime !== 0 &&
      audioState.duration !== lastAudioDuration()
    ) {
      console.log("Setting playing to false!");
      setLastAudioDuration(audioState.duration);
      setPlaying(false);
    }
  }, [playing, audioState, audioState.currentTime]);

  let currentStreamingToken: any = null;

  async function streamMessage(message: string) {
    // Cancel previous streaming if any
    if (currentStreamingToken) {
      currentStreamingToken.cancelled = true;
    }

    // Clear the streamed message immediately
    setStreamedMessage("");

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
      // setCurrentStreamedRole("assistant");
      if (messageRangeCutoff >= message.length) break;
    }
  }

  /*
  createEffect(() => {
    if (messages().length === 0) return;
    const messageContent = messages().at(-1)!.content;
    if (typeof messageContent !== "string") return;
    streamMessage(messageContent);
  });
  */

  class NoAudioStream {
    readonly _tag = "NoAudioStream";
  }

  class UnexpectedAudioTrackCount {
    readonly _tag = "UnexpectedAudioTrackCount";
  }

  function setUserMessage(message: string) {
    // if (message === "") return;
    /* if (playing())
            return console.log("Receiving, ignoring because playing.");
            */
    // setTranscribedMessage(message);
    // if (!playing() && lastTranscribedMessage() !== transcribedMessage()) {
    setCurrentStreamedRole("user");
    streamMessage(message);
    // }
  }
  function setAIMessage(message: string) {
    // setPlaying(true);
    streamMessage(message);
    // socket.emit("end-transcription");
    setCurrentStreamedRole("assistant");
    handleConversation([], demoIndex());
  }

  function streamChunksToServer(mediaStreamTrack: MediaStreamTrack) {
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
        return recorder;
      },
      (mediaRecorder) => {
        // create request and stream here

        socket.emit("start-transcription");

        /*
        socket.on("transcription-results", (message) => {
          return;
          if (message === "") return;
          if (playing()) return;
          setTranscribedMessage(message);
          if (!playing() && lastTranscribedMessage() !== transcribedMessage()) {
            setStreamedMessage(message);
            setCurrentStreamedRole("user");
          }
        });
        */

        let isHandlingConversation = false;

        socket.on("end-utterance", () => {
          return;
          if (
            playing() ||
            isHandlingConversation ||
            (currentStreamedRole() === "assistant" && messages.length !== 0)
          )
            return;
          isHandlingConversation = true;
          setPlaying(true);
          setLastTranscribedMessage(transcribedMessage());
          socket.emit("end-transcription");
          handleConversation(
            [...messages(), { role: "user", content: transcribedMessage() }],
            teams.state.id,
          ).finally(() => {
            isHandlingConversation = false;
          });
        });

        mediaRecorder.onstop = () => {
          mediaStreamTrack.stop();
        };
        mediaRecorder.ondataavailable = async (event) => {
          return;
          if (
            playing() ||
            muted() ||
            isHandlingConversation ||
            (currentStreamedRole() === "assistant" && messages.length !== 0)
          ) {
            return;
          }
          socket.emit("write-transcription", {
            dataBlob: event.data,
          });
        };

        mediaRecorder.start(100);
        setRecorder(mediaRecorder);
      },
    );
  }

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
      recorderSignal.stop();
      setRecorder(undefined);
    }
  }

  onCleanup(handleCleanup);
  const navigate = useNavigate();

  onMount(async () => {
    const teamData = await getListOfTeams();
    const defaultTeam = teamData.find((team) => team.team.defaultTeam);
    const user = await getUser();
    setUser(user);
    setPlaying(false);
    getMicStreamWithPermission();

    window.addEventListener("keydown", async (e) => {
      console.log("Running");
      if (e.key !== "p") return;
      e.preventDefault();
      setDemoIndex((index) => index + 1);
      if (demoIndex() === demoConversation.length) {
        return navigate("localhost:3000/team/1/calendar");
      }
      const message = demoConversation[demoIndex()].content as string;
      if (currentStreamedRole() === "assistant") {
        setUserMessage(demoConversation[demoIndex()].content as string);
        const nextMessage = demoConversation[demoIndex() + 1].content as string;
        if (typeof nextMessage === "string")
          await setAudioFromMessageText(nextMessage);
      } else if (currentStreamedRole() === "user") {
        setAIMessage(message);
        setPlaying(true);
      }

      if (demoIndex() === 11) {
        console.log("YO", defaultTeam?.team.id);
        await demoHelper(defaultTeam?.team.id!);
        console.log("Success");
      }
    });
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
          return url;
        },
        setAudioSource,
      );
    }
  }

  return (
    <div class="flex flex-col items-center justify-between h-full pb-8 bg-gradient-to-b from-[#7859EA] to-[#C9BDF7]">
      <div class="w-full">
        <div class="flex flex-col items-center mt-10">
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
            <Show when={currentStreamedRole() === "assistant"}>
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
              <ImageRoot class="w-12 h-12">
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
              muted() ? "bg-white text-error" : "",
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
            <ImageRoot class="p-1">
              <svg
                width="35"
                height="34"
                viewBox="0 0 35 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1993_1978)">
                  <path
                    d="M27.8685 17.0456C27.8685 18.2226 27.6723 19.3558 27.3134 20.4117L25.6147 18.713C25.7258 18.1642 25.7818 17.6056 25.7816 17.0456V14.9587C25.7816 14.682 25.8916 14.4166 26.0872 14.2209C26.2829 14.0252 26.5483 13.9153 26.8251 13.9153C27.1018 13.9153 27.3672 14.0252 27.5629 14.2209C27.7586 14.4166 27.8685 14.682 27.8685 14.9587V17.0456ZM17.4341 25.3931C19.1412 25.3931 20.7272 24.8818 22.0503 24.0012L23.5487 25.5016C22.059 26.5819 20.3088 27.2467 18.4776 27.4278V31.6537H24.7382C25.0149 31.6537 25.2803 31.7637 25.476 31.9594C25.6717 32.155 25.7816 32.4204 25.7816 32.6972C25.7816 32.9739 25.6717 33.2393 25.476 33.435C25.2803 33.6307 25.0149 33.7406 24.7382 33.7406H10.1301C9.85333 33.7406 9.58793 33.6307 9.39225 33.435C9.19656 33.2393 9.08663 32.9739 9.08663 32.6972C9.08663 32.4204 9.19656 32.155 9.39225 31.9594C9.58793 31.7637 9.85333 31.6537 10.1301 31.6537H16.3907V27.4278C13.8169 27.1691 11.431 25.9637 9.69575 24.0453C7.96052 22.1269 6.99972 19.6324 6.99976 17.0456V14.9587C6.99976 14.682 7.10969 14.4166 7.30537 14.2209C7.50105 14.0252 7.76646 13.9153 8.04319 13.9153C8.31993 13.9153 8.58533 14.0252 8.78101 14.2209C8.9767 14.4166 9.08663 14.682 9.08663 14.9587V17.0456C9.08663 19.2595 9.9661 21.3827 11.5316 22.9482C13.097 24.5136 15.2202 25.3931 17.4341 25.3931ZM23.6948 6.61124V16.7931L11.5032 4.60158C11.981 3.19761 12.9415 2.00875 14.2137 1.24665C15.486 0.484539 16.9874 0.198641 18.4507 0.43985C19.9139 0.681059 21.2441 1.43372 22.2045 2.56384C23.1648 3.69396 23.6929 5.12821 23.6948 6.61124Z"
                    fill="currentColor"
                  />
                  <path
                    d="M20.5352 22.4861L11.1735 13.1223V17.0456C11.1731 18.1419 11.4607 19.219 12.0073 20.1693C12.554 21.1195 13.3405 21.9096 14.2884 22.4604C15.2362 23.0112 16.3121 23.3035 17.4083 23.308C18.5046 23.3125 19.5828 23.0291 20.5352 22.4861ZM4.17407 3.17624L29.2166 28.2187L30.6941 26.7412L5.65158 1.69873L4.17407 3.17624Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1993_1978">
                    <rect
                      width="33.39"
                      height="33.39"
                      fill="currentColor"
                      transform="translate(0.739014 0.350586)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </ImageRoot>
          </div>
          <p>Mute</p>
        </div>
      </div>
    </div>
  );
}
