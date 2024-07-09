"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./store/constants/reduxTypes";
import { setConnected, setSocketId } from "./store/slices/socketSlice";
import { setPlayerID } from "./store/slices/playerSlice";
import {
  initSocket,
  getSocket,
  disconnectSocket,
} from "./functions/socketManager";

export default function SocketWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("SocketWrapper mounted");
  const dispatch = useAppDispatch();
  const persistedId = useAppSelector((state) => state.socket.id);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initSocket(persistedId);
      console.log("Socket: ", socketRef.current);

      socketRef.current.on("connect", () => {
        dispatch(setConnected(true));
        dispatch(setSocketId(socketRef.current?.id || null));
      });

      socketRef.current.on("disconnect", () => {
        dispatch(setConnected(false));
      });

      // listen for player id
      socketRef.current.once("player_id", (id: string) => {
        console.log("client Player ID: ", id);
        dispatch(setPlayerID(id));
      });
    }

    // Return a cleanup function
    return () => {
      disconnectSocket();
      socketRef.current = null;
    };
  }, [dispatch]);

  return <div>{children}</div>;
}
