"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./store/constants/reduxTypes";
import { getSocket, initSocket } from "./functions/socketManager";
import { setPlayerIsHost, setPlayerName } from "./store/slices/playerSlice";
import { setGame } from "./store/slices/gameSlice";
import { useSocketEvent } from "./functions/useSocketEvent";
import { QuestionMarkBackground } from "./components/QuestionMarkBackground";
import FloatingQuipsBackground from "./components/FloatingQuipsBackground";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const socket = getSocket();
  const socketID = useAppSelector((state) => state.socket.id);
  const player = useAppSelector((state) => state.player);
  const [showRules, setShowRules] = useState<boolean>(false);
  const language = useAppSelector((state) => state.language);

  const toggleRules = () => setShowRules(!showRules);

  // get code from URL for sharing link to room
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setCode(codeFromUrl);
    }
  }, [searchParams]);

  // check if socket is connected
  useEffect(() => {
    console.log("Socket: ", socket);
    console.log("socketID: ", socketID);
    if (!socket) {
      setError("Failed to connect to server. Please try again later.");
    } else {
      setError("");
    }
  }, [socket, socketID]);

  const handleValidCode = useCallback(
    (game: Game) => {
      setIsSubmitting(false);
      dispatch(setGame(game));
      router.push(`/waitingRoom?code=${game.code}`);
    },
    [dispatch, router],
  );

  const handleInvalidCode = useCallback(() => {
    setIsSubmitting(false);
    setError("Invalid code. Please try again.");
    setCode("");
  }, []);

  const handleNameTaken = useCallback(() => {
    setIsSubmitting(false);
    setError("This name is already taken. Please choose a different name.");
  }, []);

  useSocketEvent(socket, "validCode", handleValidCode);
  useSocketEvent(socket, "invalidCode", handleInvalidCode);
  useSocketEvent(socket, "nameTaken", handleNameTaken);

  function createPlayer({ isHost }: { isHost: boolean }) {
    dispatch(setPlayerName(name));
    dispatch(setPlayerIsHost(isHost));
  }

  const handleHostClick = () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    createPlayer({ isHost: true });
    router.push("/hostSettings");
  };

  const handleJoinClick = () => {
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    if (code === "") {
      setError("Please enter a game code");
      return;
    }
    setError("");
    setIsSubmitting(true);
    createPlayer({ isHost: false });
    console.log("Code: ", code);
    console.log("Player: ", { ...player, name });
    socket?.emit("joinGame", { code, player: { ...player, name, isHost: false } });
  };

  return (
    <div className="min-h-screen bg-background-light  flex flex-col items-center justify-center p-4 relative z-10">
      <div className="text-center mb-8 p-4 bg-black bg-opacity-50 rounded-lg animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-2 text-white text-shadow-lg">Welcome to QuipQuest!</h1>
        <p className="text-2xl font-bold text-white text-shadow-md italic">Where wit meets laughter!</p>
      </div>
      {/* <QuestionMarkBackground /> */}
      <FloatingQuipsBackground />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 mb-4 border border-background-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter game code (to join)"
          className="w-full px-4 py-2 mb-4 border border-background-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 placeholder-gray-400"
        />
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleHostClick}
            className="w-1/2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
          >
            Host
          </button>
          <button
            onClick={handleJoinClick}
            className={`w-1/2 py-2 px-4 rounded-md text-white transition duration-300 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-secondary hover:bg-secondary-dark"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join"}
          </button>
        </div>
        <button
          onClick={toggleRules}
          className="w-full bg-background-dark text-primary py-2 px-4 rounded-md hover:bg-background transition duration-300"
        >
          View Rules
        </button>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>

      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-primary-dark">QuipQuest Rules</h2>
            <ul className="list-disc pl-5 mb-4 text-black">
              <li>Players take turns answering prompts with witty responses.</li>
              <li>Other players vote for their favorite answers.</li>
              <li>Points are awarded based on votes received.</li>
              <li>The player with the most points at the end wins!</li>
            </ul>
            <button
              onClick={toggleRules}
              className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary-dark transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
