import { io } from "socket.io-client";
import { type ClientSocket } from "~/types/socket";

export const clientSocket: ClientSocket = io({ path: "/api/ws" });