import { APIEvent } from "@solidjs/start/server";
import { Server } from "socket.io";
import { SocketWithIO, IOSocketServer } from "~/types/socket";

import { SpeechClient } from "@google-cloud/speech";

type RecognizeStream = ReturnType<SpeechClient["streamingRecognize"]>;

console.log({ apiKey: process.env.GOOGLE_API_KEY! });
const client = new SpeechClient({ apiKey: process.env.GOOGLE_API_KEY! });

export function GET({ request, nativeEvent }: APIEvent) {
  const socket = nativeEvent.node.res.socket as SocketWithIO | null;
  if (!socket) return;
  if (socket.server.io) {
    console.log(
      "Socket is already running ",
      //+
      // request.url,
      // request
    );
  } else {
    console.log("Initializing Socket");

    const io: IOSocketServer = new Server(socket.server, {
      path: "/api/ws",
    });

    socket.server.io = io;

    const users: Record<string, string> = {};

    /*
export async function processAudioFrame(frameDataStream: {
  id: number;
  base64AudioChunk: string;
  options: {
    languageCode: "en-US";
  };
}, recognize: RecognizeStream) {
  */

    io.on("connection", (socket) => {
      let recognizeStream = client
        .streamingRecognize({
          config: {
            encoding: "WEBM_OPUS",
            sampleRateHertz: 16000,
            languageCode: "en-US",
          },
          interimResults: true,
        })
        .on("error", (error) => {
          console.error("Error during streaming recognition:", error);
        });

      socket.on("start-transcription", () => {
        console.log("Started transcription");

        recognizeStream.on("data", (data) => {
          if (data && data.results[0] && data.results[0].alternatives[0]) {
            console.log(
              `Transcription: ${data.results[0].alternatives[0].transcript}`,
            );

            socket.emit(
              "transcription-results",
              data.results[0].alternatives[0].transcript,
            );
          }
        });
      });

      socket.on("write-transcription", (frameDataStream) => {
        const bufferChunk = Buffer.from(
          frameDataStream.base64AudioChunk,
          "base64",
        );
        console.log("Received audio chunk of size:", bufferChunk.byteLength);

        recognizeStream.write(bufferChunk);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        if (recognizeStream) {
          recognizeStream.end();
        }
      });

      socket.on("new-user", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connected", name);
      });
      socket.on("send-chat-message", (message) => {
        socket.broadcast.emit("chat-message", {
          message: message,
          name: users[socket.id],
        });
      });
      socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
      });

      // streaming audio to google-tts
    });

    return new Response();
  }
}
