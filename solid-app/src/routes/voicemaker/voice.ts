import { Cause, Effect, Exit, pipe } from "effect";
import {
  StringifyError,
  FetchError,
} from "../../api/claude/effectGraph/callClaude";

const VOICEMAKER_API_ENDPOINT = "https://developer.voicemaker.in/voice/api";

const voicemakerApiKey = process.env.VOICEMAKER_API_KEY;

export type VoiceId = "proplus-Lily" | "proplus-Aurora";

type VoicemakerBody = {
  Engine: "neural";
  VoiceId: VoiceId;
  LanguageCode: "multi-lang";
  Text: string;
  OutputFormat: "mp3";
  SampleRate: 48000 | 16000 | 8000;
  Effect: "default";
  ResponseType: "stream";
  proEngine?: "turbo";
};

// what settings do we need? VoiceID, turbo? and text

export async function POST(params: {
  nativeEvent: { web: { request: Request } };
}) {
  const result = (await params.nativeEvent.web.request.json()) as {
    VoiceId: VoiceId;
    turbo?: "turbo";
    Text: string;
  };

  return pipe(
    result,
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
          onFailure: (cause) => {
            pipe(cause, Cause.pretty, console.error);
            return new Response(null, { status: 500 });
          },
          onSuccess: async (result) => {
            console.log("Got audio!");
            console.log(result.stream);
            const res = new Response(result, { status: 200 });
            return res;
          },
        }),
      ),
  );
}
