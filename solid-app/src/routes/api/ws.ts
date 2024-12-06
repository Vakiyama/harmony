import { APIEvent } from "@solidjs/start/server";
import { Server } from "socket.io";
import { SocketWithIO, IOSocketServer, SocketServer } from "~/types/socket";
import {
  createClient,
  ListenLiveClient,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

// URL for the realtime streaming audio you would like to transcribe
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export class SocketIo {
  private static io: Server;

  public static getInstance(server: SocketServer): Server {
    if (!SocketIo.io) {
      SocketIo.io = new Server(server, {
        path: "/api/ws",
      });
    }

    return SocketIo.io;
  }
}

export function GET({ nativeEvent }: APIEvent) {
  const socket = nativeEvent.node.res.socket as SocketWithIO | null;
  if (!socket) return;
  if (socket.server.io) {
    console.log(
      "Socket is already running "
      //+
      // request.url,
      // request
    );
  } else {
    console.log("Initializing Socket");

    const io: IOSocketServer = SocketIo.getInstance(socket.server);

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
      let connection: ReturnType<typeof deepgram.listen.live> | null = null;

      const keepAlive = setInterval(() => {
        if (!connection) return;
        connection.keepAlive();
      }, 5000);

      socket.on("end-transcription", () => {
        if (!connection) return;
        connection.requestClose();
        connection = null;
      });

      socket.on("write-transcription", (frameDataStream) => {
        /*
        const bufferChunk = Buffer.from(
          frameDataStream.base64AudioChunk,
          "base64",
        );
        */
        /*
        console.log(
                    frameDataStream.dataBlob
            .arrayBuffer()
            .then((buffer) => buffer.byteLength),
        );
        */

        if (!connection) {
          connection = deepgram.listen.live({
            model: "nova-2",
            language: "en-US",
            smart_format: true,
            interim_results: true,
            utterance_end_ms: 1000,
            keywords: ["Harmony", "mood", "journal", "entry", "note"],
            sample_rate: frameDataStream.sampleRate,
            encoding: "linear16",
          });
          connection.on(LiveTranscriptionEvents.Open, () => {
            if (!connection) return;
            connection.on(LiveTranscriptionEvents.Close, () => {
              socket.emit("end-utterance");
              console.log("Connection close event.");
            });

            connection.on(LiveTranscriptionEvents.Transcript, (data) => {
              console.log(
                `Transcription: ${data.channel.alternatives[0].transcript}`,
              );
              socket.emit(
                "transcription-results",
                data.channel.alternatives[0].transcript,
              );
            });

            connection.on(LiveTranscriptionEvents.Metadata, (data) => {
              console.log("meta:", data);
            });

            connection.on(LiveTranscriptionEvents.Error, (err) => {
              console.error(err);
            });

            connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
              console.log("end utterance event ifred");
              socket.emit("end-utterance");
            });
          });
        }
        console.log(
          "Frame:",
          frameDataStream.data.byteLength,
          frameDataStream.sampleRate,
        );
        connection.send(frameDataStream.data);
      });

      /*
      socket.on("end-transcription", () => {
        console.log("end transcription");
        stopStream();
      });
      */

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(keepAlive);
        if (!connection) return;
        connection.requestClose();
        connection = null;
      });

      socket.on("new-user", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-connected", name);
        socket.join(name);
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

      socket.on("create-journal-entry", (entryData) => {
        socket.broadcast
          .to(entryData.userId)
          .emit("journal-entry-created", entryData.type);
      });

      socket.on("edit-journal-entry", (updatedEntry) => {
        socket.broadcast
          .to(updatedEntry.userId)
          .emit("journal-entry-edited", updatedEntry.type);
      });

      socket.on("delete-journal-entry", (deletedEntry) => {
        socket.broadcast
          .to(deletedEntry.userId)
          .emit("journal-entry-deleted", deletedEntry.type);
      });

      // Calendar Event Handlers
      socket.on("create-calendar-event", (eventData) => {
        socket.broadcast
          .to(eventData.userId)
          .emit("calendar-event-created", eventData.title);
      });

      socket.on("edit-calendar-event", (eventData) => {
        socket.broadcast
          .to(eventData.userId)
          .emit("calendar-event-edited", eventData.title);
      });

      socket.on("delete-calendar-event", (eventData) => {
        socket.broadcast
          .to(eventData.userId)
          .emit("calendar-event-deleted", eventData.title);
      });
      socket.on("complete-calendar-task", (eventData) => {
        socket.broadcast
          .to(eventData.userId)
          .emit("calendar-task-completed", eventData);
      });
      socket.on("update-status-calendar-event", (eventData) => {
        socket.broadcast
          .to(eventData.userId)
          .emit("status-calendar-event-updated", eventData);
      });
    });

    return new Response();
  }
}
