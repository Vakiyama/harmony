import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer, Socket as IOServerSocket } from "socket.io";
import type { Socket as IOClientSocket } from "socket.io-client";
import {
  CalendarEventType,
  JournalReturnType,
} from "~/routes/Team/[id]/Calendar";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

export interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface ServerToClientEvents {
  "user-connected": (name: string) => void;
  "chat-message": (data: { message: string; name: string }) => void;
  "user-disconnected": (name: string) => void;
  "transcription-results": (message: string) => void;
  "end-utterance": () => void;
  // Journal Entry Events
  "journal-entry-created": (journal: JournalReturnType) => void;
  "journal-entry-edited": (journal: JournalReturnType) => void;
  "journal-entry-deleted": (entryId: string) => void;

  // Calendar Event Events
  "calendar-event-created": (event: CalendarEventType) => void;
  "calendar-event-edited": (event: CalendarEventType) => void;
  "calendar-event-deleted": (eventId: string) => void;
}

export interface ClientToServerEvents {
  "new-user": (name: string) => void;
  "send-chat-message": (message: string) => void;
  "write-transcription": (frameDataStream: { dataBlob: Blob }) => void;
  "start-transcription": () => void;
  "end-transcription": () => void;
  // Journal Entry Events
  "create-journal-entry": (
    entry: Omit<JournalReturnType, "id" | "createdAt" | "updatedAt">
  ) => void;
  "edit-journal-entry": (
    entry: Partial<JournalReturnType> & { id: string }
  ) => void;
  "delete-journal-entry": (entryId: string) => void;

  // Calendar Event Events
  "create-calendar-event": (event: Omit<CalendarEventType, "id">) => void;
  "edit-calendar-event": (
    event: Partial<CalendarEventType> & { id: string }
  ) => void;
  "delete-calendar-event": (eventId: string) => void;
}

interface InterServerEvents {
  // ping: () => void;
}

interface SocketData {
  // user: {
  //   id: string;
  //   username: string;
  // };
}

export type IOSocketServer = IOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ServerSocket = IOServerSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ClientSocket = IOClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;
