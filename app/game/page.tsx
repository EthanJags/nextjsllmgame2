"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import Answering from "../components/gameScreens/Answering";
import AwaitingResponses from "../components/gameScreens/AwaitingResponses";
import { time } from "console";
import TimerBar from "../components/TimerBar/TimerBar";
import { setCurrentStage, setGame } from "../store/slices/gameSlice";
import Voting from "../components/gameScreens/Voting";
import AwaitingVotes from "../components/gameScreens/AwaitingVotes";
import Score from "../components/gameScreens/Score";
import EndGame from "../components/gameScreens/EndGame";
import Results from "../components/gameScreens/Results";

export default function Game() {
  const router = useRouter();
  const socket = getSocket();
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const game = useAppSelector((state) => state.game);
  const currentStage = useAppSelector((state) => state.game.currentStage);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(0);
  const socketID = useAppSelector((state) => state.socket.id);
  const playerId = useAppSelector((state) => state.player.id);
  const alertShown = useRef(false);

  

  useEffect(() => {
    if (socketID && game.code !== -1) {
      const socket = initSocket(socketID, playerId);
      console.log("Socket: ", socket);

      // check for game updates
      console.log("Requesting game update", game.code);
      socket.emit("requestGameUpdate", game.code);

      // if code is valid
      socket.on("gameUpdate", (data: { game: Game; action?: string }) => {
        const { game } = data;
        dispatch(setGame(game));
        if (!game.gameActive) {
          console.log("Game no longer active");
        }
      });

      // if code is invalid
      socket.once("gameNotActive", () => {
        console.log("Game no longer active");
        alert("Game no longer active");
        router.push("/");
      });

      setIsLoading(false);
    } else {
      if (!alertShown.current) {
        alert("No socket ID or game code");
        alertShown.current = true;
        router.push("/");
      }
    }
  }, [socketID]);

  const fetchQuestion = () => {
    if (!socket) return;
    socket.emit("requestQuestion", { gameCode: game.code });
  };

  useEffect(() => {
    console.log("current Stage: ", currentStage);
  }, [currentStage]);

  // TIMER LOGIC
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            dispatch(setCurrentStage("AwaitingResponses"));
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, socket, game.code]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!socket) {
    return <div className="flex justify-center items-center h-screen">Socket is undefined</div>;
  }

  const renderGameContent = () => {
    switch (currentStage) {
      case "Answering":
        return <Answering socket={socket} />;
      case "AwaitingResponses":
        return <AwaitingResponses socket={socket} />;
      case "Voting":
        return <Voting socket={socket} />;
      case "AwaitingVotes":
        return <AwaitingVotes socket={socket} />;
      case "Results":
        return <Results socket={socket} />;
      case "Score":
        return <Score socket={socket} />;
      case "End":
        return <EndGame />;
      default:
        return <div>Unknown game stage</div>;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 p-4">
      {/* Game Info Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg text-indigo-700">{player.name}</p>
            <p className="text-sm text-gray-600">Score: {player.score}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Round</p>
            <p className="text-2xl font-bold text-indigo-700">
              {game.currentRound} / {game.gameSettings.rounds}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />
        </div>
      </div>

      {/* Game Content */}
      <div className="bg-white rounded-lg shadow-md p-6">{renderGameContent()}</div>
    </div>
  );
}
