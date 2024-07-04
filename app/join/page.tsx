"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket } from "../functions/socketManager";
import { setGame } from "../store/slices/gameSlice";

export default function Join() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const socket = getSocket();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!player.name || !socket) {
      router.push("/");
    } else {
      setIsLoading(false);
    }

    // Set up event listeners
    if (socket) {
      const handleValidCode = (game: Game) => {
        dispatch(setGame(game));
        router.push(`/waitingRoom?code=${game.code}`);
      };

      const handleInvalidCode = () => {
        alert("Invalid Code");
        setCode("");
      };

      // Remove any existing listeners before adding new ones
      socket.off("validCode");
      socket.off("invalidCode");

      socket.on("validCode", handleValidCode);
      socket.on("invalidCode", handleInvalidCode);

      // Cleanup function
      return () => {
        socket.off("validCode", handleValidCode);
        socket.off("invalidCode", handleInvalidCode);
      };
    }
  }, [player.name, socket, dispatch, router]);

  const handleSubmit = () => {
    if (!socket) return;
    console.log("Code: ", code);
    console.log("Player: ", player);
    socket.emit("joinGame", { code, player });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {player.name}!</h1>
      <input
        type="number"
        id="codeInput"
        value={code}
        style={{ color: "black" }}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here"
      />
      <button onClick={handleSubmit} type="submit">Submit</button>
    </div>
  );
}