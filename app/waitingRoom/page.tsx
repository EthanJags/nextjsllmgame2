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
import { getSocket, initSocket } from "../functions/socketManager";
import {
  setGame,
  addPlayer,
  setCurrentQuestion,
} from "../store/slices/gameSlice";

export default function WaitingRoom() {
  const router = useRouter();
  const socket = getSocket();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useSelector((state: RootState) => state.game);
  const socketID = useSelector((state: RootState) => state.socket.id);
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    console.log("Waiting Room mounted");
    console.log("socketID: ", socketID);
    console.log("Player: ", player);
    if (socketID && player.name) {
      // reinitialize socket
      const socket = initSocket(socketID);
      console.log("Socket: ", socket);
      setIsLoading(false);

      // check for game updates
      console.log("Requesting game update", game.code);
      socket.emit("requestGameUpdate", game.code);

      // if code is valid
      socket.on("gameUpdate", (game: Game) => {
        console.log("Game Update: ", game);
        dispatch(setGame(game));
      });

      // if code is invalid
      socket.once("gameNotActive", () => {
        console.log("Game no longer active");
        alert("Game no longer active");
        router.push("/");
      });

      // add Player
      socket.on("addPlayer", (player: Player) => {
        console.log("Player added: ", player);
        dispatch(addPlayer(player));
      });

      // listener for acknocledgement of backend
      socket.once("gameStarted", (question: string) => {
        dispatch(setCurrentQuestion(question));
        // redirect to game page
        router.push(`/game`);
      });

      // Cleanup function
      return () => {
        socket.off("gameUpdate");
        socket.off("gameNotActive");
        socket.off("addPlayer");
        socket.off("gameStarted");
      };
    } else {
      router.push("/");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const handleStartClick = () => {
    if (!socket) return;
    socket.emit("startGame");
  };

  const handleShareLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}?code=${game.code}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 4000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(game.code.toString())
      .then(() => {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy game code: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-primary-dark flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-primary-dark text-center">
          Waiting Room
        </h1>
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-gray-700">Game Code:</p>
          <div 
            className="relative inline-block cursor-pointer group"
            onClick={handleCopyGameCode}
          >
            <p className="text-4xl font-bold text-primary transition-colors duration-300 group-hover:text-primary-dark">
              {game.code}
            </p>
            <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 ${codeCopied ? 'opacity-75' : ''}`}>
              Copied!
            </span>
          <p className="text-xs text-gray-500 mt-1">Click to copy</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Welcome, {player.name}!
        </h2>

        <div className="mb-6">
          <PlayersList />
        </div>

        {player.isHost ? (
          <button
            onClick={handleStartClick}
            className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out mb-4"
          >
            Start Game
          </button>
        ) : (
          <p className="text-sm text-gray-600 italic text-center mb-4">
            Tell the host if you are ready to start
          </p>
        )}

        <button
          onClick={handleShareLink}
          className={`w-full font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out ${
            linkCopied
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {linkCopied ? "Link Copied!" : "Share Link"}
        </button>
      </div>
    </div>
  );
}
