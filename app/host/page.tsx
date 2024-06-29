"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";

let socket: Socket;

export default function Host() {
  const searchParam = useSearchParams();
  const name = searchParam.get("name") as string;

  const [code, setCode] = useState<number | null>(null);
  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [players, setPlayers] = useState<Players>({});

  useEffect(() => {
    // Generate a random 6-digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setCode(randomCode);

    // Connect to the server
    const socket = io();

    socket.on("roomCreated", () => {
      setRoomCreated(true);
    });

    if (socket.id === undefined) {
      console.error("Error: Socket ID is undefined. Cannot create room.");
      return;
    }
    // create a new player and set to currentPlayer
    const currPlayer: Player = {
      id: socket.id,
      name: name,
      isHost: true,
      score: 0,
    };
    // create a players object
    setPlayers({ [socket.id]: currPlayer });

    // create a new room
    const currRoom: Room = {
      code: randomCode,
      name: name,
      Players: players,
      highScore: 0,
      highScorePlayer: "Nobody",
    };

    // emit the new room to the server
    socket.emit("createRoom", currRoom);

    // event listener for knowing if the room was created
    socket.on("roomCreated", (room: Room) => {
      console.log("Room created: ", room);
    });

    // event listener for updating the players
    socket.on("updatePlayers", (updatedPlayers: Players) => {
      console.log("Players updated: ", updatedPlayers);
      setPlayers(updatedPlayers);
    });
  }, []);

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      {roomCreated ? (
        <div>
          <h1>Room code: {code}</h1>
          <PlayersList players={players} />
          <button>Start Game</button>
        </div>
      ) : (
        <h1>Creating room...</h1>
      )}
    </div>
  );
}
