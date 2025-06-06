import { useEffect } from "react";
import { Socket } from "socket.io-client";

export const useSocketEvent = <T>(socket: Socket | null, event: string, handler: (data: T) => void) => {
  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};
