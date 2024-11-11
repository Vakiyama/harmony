"use server";

import { Cause, Effect, Exit, pipe } from "effect";
import { StringifyError, FetchError } from "../claude/effectGraph/callClaude";
import { SpeechClient } from "@google-cloud/speech";

const VOICEMAKER_API_ENDPOINT = "https://developer.voicemaker.in/voice/api";

const voicemakerApiKey = process.env.VOICEMAKER_API_KEY;

// import fs from "fs/promises";
import readline from "readline";
import { Transform } from "stream";
import { TransformCallback } from "postcss";
import { StringFromBase64 } from "effect/Schema";

// (!voicemakerApiKey) throw new Error("Missing api key: VOICEMAKER_API_KEY");

type VoiceId = "proplus-Lily" | "proplus-Aurora";

type VoicemakerBody = {
  Engine: "neural";
  VoiceId: VoiceId;
  LanguageCode: "multi-lang";
  Text: string;
  OutputFormat: "mp3";
  SampleRate: 48000;
  Effect: "default";
  ResponseType: "stream";
  proEngine?: "turbo";
};

// what settings do we need? VoiceID, turbo? and text

export function getAudio(params: {
  VoiceId: VoiceId;
  turbo?: "turbo";
  Text: string;
}) {
  return pipe(
    params,
    (params) => {
      const voicemakerBody: VoicemakerBody = {
        ...params,
        Engine: "neural",
        LanguageCode: "multi-lang",
        OutputFormat: "mp3",
        SampleRate: 48000,
        Effect: "default",
        ResponseType: "stream",
      };

      return Effect.try({
        try: () => JSON.stringify(voicemakerBody),
        catch: (e) => StringifyError(), // should catch with info...
      });
    },
    Effect.flatMap((stringifiedBody) =>
      Effect.tryPromise({
        try: () =>
          fetch(VOICEMAKER_API_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${voicemakerApiKey}`,
            },
            body: stringifiedBody,
          }),
        catch: (e) => FetchError(e as Error),
      }),
    ),
    Effect.flatMap((res) =>
      Effect.try({
        try: () => {
          if (res.status !== 200) throw new Error();
          console.error("!200 req", res);
          return res;
        },
        catch: (e) => FetchError(e as Error),
      }),
    ),
    Effect.flatMap((res) =>
      Effect.tryPromise({
        try: () => res.blob(),
        catch: (e) => FetchError(e as Error),
      }),
    ),
    Effect.retry({ times: 3 }), // network failures
    Effect.runPromiseExit,
    async (blobExitPromise) =>
      pipe(
        await blobExitPromise,
        Exit.match({
          onFailure: (cause) => pipe(cause, Cause.pretty, console.error),
          onSuccess: (result) =>
            pipe(result.arrayBuffer(), async (arrayBuffer) =>
              btoa(String.fromCharCode(...new Uint8Array(await arrayBuffer))),
            ),
        }),
      ),
  );
}

const sessions: {
  id: number;
  recognizeStream: ReturnType<SpeechClient["streamingRecognize"]>;
  message: string;
}[] = [];

export function endAudioProcessing(id: number) {
  const index = sessions.findIndex((session) => session.id === id);
  sessions.splice(index, 1);
}

console.log({ apiKey: process.env.GOOGLE_API_KEY! });
const client = new SpeechClient({ apiKey: process.env.GOOGLE_API_KEY! });

export async function processAudioFrame(frameDataStream: {
  id: number;
  base64AudioChunk: string;
  options: {
    languageCode: "en-US";
  };
}) {
  const bufferChunk = Buffer.from(
    frameDataStream.base64AudioChunk.toString(),
    "base64",
  );

  let sessionIndex = sessions.findIndex(
    (session) => session.id === frameDataStream.id,
  );
  if (sessionIndex === -1) {
    const recognizeStream = client
      .streamingRecognize({
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 16000,
          languageCode: frameDataStream.options.languageCode,
        },
        interimResults: true,
      })
      .on("error", console.error);

    sessionIndex =
      sessions.push({
        id: frameDataStream.id,
        recognizeStream,
        message: "",
      }) - 1;

    recognizeStream
      .on("data", (data: any) => {
        console.log(data);
        if (data && data.results[0] && data.results[0].alternatives[0]) {
          console.log(
            `Transcription: ${data.results[0].alternatives[0].transcript}`,
          );

          sessions[sessionIndex].message =
            data.results[0].alternatives[0].transcript;
        }
      })
      .on("error", (error: any) => {
        console.error("Error during streaming recognition:", error);
      });
  }

  const { recognizeStream } = sessions[sessionIndex];

  // console.log(sessions.length);
  // console.log("Writing chunk...");
  // console.log(sessionIndex);
  recognizeStream.write(bufferChunk);

  return sessions[sessionIndex].message;
}
