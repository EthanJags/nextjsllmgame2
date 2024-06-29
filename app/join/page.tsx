"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";

let socket: Socket;

export default function Join() {
  const searchParam = useSearchParams();
  const name = searchParam.get("name") as string;

  const [code, setCode] = useState<
    string | number | readonly string[] | undefined
  >("");
  const [roomCreated, setRoomCreated] = useState<boolean>(false);
  const [players, setPlayers] = useState<Players>({});

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Connect to the server
    const socket = io();

    // emit the code to the server
    socket.emit("joinRoom", code);

    // event listener for knowing if the room was joined
    socket.on("roomJoined", (room: Room) => {
      if (room === undefined) {
        console.error("Error: Room is undefined. Cannot join room.");
      } else {
        console.log("Room joined: ", room);
      }
    });
  };

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <input
        type="number"
        id="codeInput"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here"
      />
      <button type="submit">Submit</button>
    </div>
  );
}
