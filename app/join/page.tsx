"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { resetGame, setGame } from "../store/slices/gameSlice";

export default function Join() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const socket = getSocket();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketID = useAppSelector((state) => state.socket.id);
  const playerId = useAppSelector((state) => state.player.id);

  useEffect(() => {
    console.log("socketID: ", socketID);
    if (socketID && player.name) {
      const socket = initSocket(socketID, playerId);
      console.log("Socket: ", socket);
      console.log("Player: ", player);
      setIsLoading(false);
    } else {
      router.push("/");
    }

    if (socket) {
      const handleValidCode = (game: Game) => {
        setIsSubmitting(false);
        dispatch(setGame(game));
        router.push(`/waitingRoom?code=${game.code}`);
      };

      const handleInvalidCode = () => {
        setIsSubmitting(false);
        setError("Invalid code. Please try again.");
        setCode("");
      };

      socket.off("validCode");
      socket.off("invalidCode");

      socket.on("validCode", handleValidCode);
      socket.on("invalidCode", handleInvalidCode);

      return () => {
        socket.off("validCode", handleValidCode);
        socket.off("invalidCode", handleInvalidCode);
      };
    }
  }, [player.name, socket, dispatch, router, socketID]);

  const handleSubmit = () => {
    if (!socket) return;
    setError("");
    setIsSubmitting(true);
    console.log("Code: ", code);
    console.log("Player: ", player);
    socket.emit("joinGame", { code, player });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary-dark text-center">Welcome, {player.name}!</h1>
        <div className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="codeInput"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-background-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-placeholder appearance-none"
          />
          <button
            onClick={handleSubmit}
            className={`w-full py-2 px-4 rounded-md text-white transition duration-300 ${
              isSubmitting || code.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-secondary hover:bg-secondary-dark"
            }`}
            disabled={isSubmitting || code.length === 0}
          >
            {isSubmitting ? "Joining..." : "Join Game"}
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}
