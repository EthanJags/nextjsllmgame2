// socketManager.ts
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "../store/constants/reduxTypes";

let socket: Socket | null = null;

export const initSocket = (persistedId: string | null, playerId: string) => {
  console.log("initSocket called", persistedId);
  if (!socket) {
    const socketUrl = "wss://quipquestcli-53f759c18f0f.herokuapp.com/";
    console.log("socketUrl: ", socketUrl);
    socket = io(socketUrl, {
      query: persistedId ? { id: persistedId } : undefined,
      auth: playerId !== "" ? { playerId } : {},
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
