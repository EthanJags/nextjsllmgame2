"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "./store/constants/reduxTypes";
import { createSocket } from "./store/actions/socket";
import { setSocket } from "./functions/socketManager";
import { setPlayerID } from "./store/slices/playerSlice";

export default function SocketWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("SocketWrapper mounted");
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      // connect to the server only if a connection doesn't exist
      socketRef.current = io("http://localhost:3000");
      console.log("Socket: ", socketRef.current);
      setSocket(socketRef.current);

      // listen for player id
      socketRef.current.once("player_id", (id: string) => {
        console.log("client Player ID: ", id);
        dispatch(setPlayerID(id));
      });

      // Uncomment and modify these as needed
      // socketRef.current.on("connect", () => {
      //     console.log("Connected to server");
      // });

      // socketRef.current.on("updatePlayers", (players: Players) => {
      //   console.log("Players: ", players);
      //   dispatch({ type: "UPDATE_PLAYERS", payload: { players } });
      // });
    }
    
    // Return a cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch]);

  return <div>{children}</div>;
}