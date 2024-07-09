// socketManager.ts
import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (persistedId: string | null) => {
  console.log("initSocket called", persistedId);
  if (!socket) {
    socket = io("http://localhost:3000", {
      query: persistedId ? { id: persistedId } : undefined,
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
