"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/constants/reduxTypes";
import { getSocket } from "../functions/socketManager";


export default function WaitingRoom() {
  const router = useRouter();
  const socket = getSocket();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useSelector((state: RootState) => state.game);

  useEffect(() => {
    console.log("Player: ", player);
    console.log("Socket: ", socket);
    console.log("Game: ", game);
    if (!player || !socket || !game) {
      router.push("/");
    } else {
        setIsLoading(false);
    }
}, [player, socket]);

if (isLoading) {
    return <h1>Loading...</h1>;
}

const handleStartClick = () => {
  if (!socket) return;
  // emit start game event
  socket.emit("startGame");

  // listener for acknocledgement of backend
  socket.on("gameStarted", () => {
    // redirect to game page
    router.push(`/game`);
  });
}

  return (
    <div>
      <h1>Waiting Room</h1>
      <h1>Enter Code: {game.code} to join</h1>
        <h2>Welcome {player.name}</h2>
        <PlayersList/>
        {player.isHost && <button onClick={handleStartClick}>Start Game</button>}
    </div>
  )};