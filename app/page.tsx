"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./store/constants/reduxTypes";
import { getSocket } from "./functions/socketManager";
import { setPlayerIsHost, setPlayerName } from "./store/slices/playerSlice";
import { resetGame } from "./store/slices/gameSlice";



export default function Home() {
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const socket = getSocket();
  useEffect(() => {
  console.log("Socket: ", socket);

  // dispatch(setPlayerName(""));
  // dispatch(resetGame());
  }, []);
  

  function createPlayer({ isHost }: { isHost: boolean }) {
    if (!socket) {
      console.error("Socket is undefined");
      alert("Socket is undefined");
      return;
    }
    if (name === "") {
      alert("Please enter a name");
      return;
    }
    // send player name and isHost to store
    dispatch(setPlayerName(name));
    dispatch(setPlayerIsHost(isHost));
  };

  const handleHostClick = () => {
    createPlayer({ isHost: true })
      // navigate to hostSettings
    router.push("/hostSettings");
  };
  

  const handleJoinClick = () => {
    createPlayer( { isHost: false })
    // navigate to join
    router.push("/join");
  }


  return (
    <div>
      <h1>Welcome, to the LLM Game!</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ color: "black" }}
      />
      <button onClick={handleHostClick}>Host</button>
      <button onClick={handleJoinClick}>Join</button>
    </div>
  );
}
