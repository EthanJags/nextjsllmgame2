"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { setGame, addPlayer, resetGame } from "../store/slices/gameSlice";

export default function HostSettings() {
  const router = useRouter();
  const socket = getSocket();
  const player = useAppSelector((state) => state.player);
  const [isLoading, setIsLoading] = useState(true);
  const socketID = useAppSelector((state) => state.socket.id);
  const dispatch = useAppDispatch();

  const [rounds, setRounds] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  useEffect(() => {
    if (socketID && player.isHost && player.name) {
      const socket = initSocket(socketID);
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }, [player.name, socketID, player.isHost, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const handleStartClick = () => {
    if (!socket) return;
    const gameSettings = { rounds, timePerQuestion };
    socket.emit("createGame", gameSettings, player);
    dispatch(resetGame());

    socket.once("gameCreated", (game) => {
      dispatch(setGame(game));
      dispatch(addPlayer(player));
      router.push(`/waitingRoom?code=${game.code}`);
    });
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary-dark text-center">
          Welcome, {player.name}!
        </h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Game Settings
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="rounds"
              className="mb-2 text-sm font-medium text-gray-600"
            >
              Number of Rounds:
            </label>
            <select
              id="rounds"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
            >
              {[3, 5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="timePerQuestion"
              className="mb-2 text-sm font-medium text-gray-600"
            >
              Time per Question (seconds):
            </label>
            <select
              id="timePerQuestion"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
            >
              {[15, 30, 45, 60, 90].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleStartClick}
          className="w-full mt-6 bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Create Game
        </button>
      </div>
    </div>
  );
}
