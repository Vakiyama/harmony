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
  "journal-entry-created": (type: string) => void;
  "journal-entry-edited": (journal: string) => void;
  "journal-entry-deleted": (entryId: string) => void;

  // Calendar Event Events
  "calendar-event-created": (event: string) => void;
  "calendar-event-edited": (eventTitle: string) => void;
  "calendar-event-deleted": (eventId: string) => void;
  "calendar-task-completed": (event: {
    title: string;
    userId: string;
    complete: boolean;
  }) => void;
  "status-calendar-event-updated": (event: {
    title: string;
    userId: string;
    status: string;
    user: string;
  }) => void;
}

export interface ClientToServerEvents {
  "new-user": (name: string) => void;
  "send-chat-message": (message: string) => void;
  "write-transcription": (frameDataStream: { dataBlob: Blob }) => void;
  "start-transcription": () => void;
  "end-transcription": () => void;
  // Journal Entry Events
  "create-journal-entry": (entry: { type: string; userId: string }) => void;
  "edit-journal-entry": (entry: { type: string; userId: string }) => void;
  "delete-journal-entry": (entry: { type: string; userId: string }) => void;
  // Calendar Event Events
  "complete-calendar-task": (event: {
    title: string;
    userId: string;
    complete: boolean;
  }) => void;
  "update-status-calendar-event": (event: {
    title: string;
    userId: string;
    status: string;
    user: string;
  }) => void;
  "create-calendar-event": (event: { title: string; userId: string }) => void;
  "edit-calendar-event": (event: { title: string; userId: string }) => void;
  "delete-calendar-event": (eventId: { title: string; userId: string }) => void;
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
