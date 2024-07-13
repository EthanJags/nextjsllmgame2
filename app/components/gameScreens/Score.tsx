import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/app/store/constants/reduxTypes";
import { setCurrentStage, incrementRound, setGame } from "@/app/store/slices/gameSlice";
import Leaderboard from "../Leaderboard";
import { useSocketEvent } from "@/app/functions/useSocketEvent";

const Score: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const players = useAppSelector((state) => state.game.players);
  const player = useAppSelector((state) => state.player);
  const currentRound = useAppSelector((state) => state.game.currentRound);
  const maxRounds = useAppSelector((state) => state.game.gameSettings.rounds);
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          dispatch(incrementRound());
          if (currentRound < maxRounds) {
            // emit next round
            handleStartRound();
          } else {
            dispatch(setCurrentStage("End"));
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, currentRound, maxRounds]);

  const handleStartRound = () => () => {
    socket.emit("nextRound");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gradient-to-b from-indigo-100 to-indigo-200">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Scores</h1>
        <Leaderboard players={players} />
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-600">
            Next round starting in <span className="font-bold text-indigo-600">{timeLeft}</span> seconds
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            ></div>
          </div>
          {player.isHost && (
            <button
              className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              onClick={handleStartRound()}
            >
              Start Next Round
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Score;
