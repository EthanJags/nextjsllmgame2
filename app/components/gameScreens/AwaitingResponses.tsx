import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import { setAnswers, setCurrentStage } from "@/app/store/slices/gameSlice";

const AwaitingResponses: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const [answersRecieved, setAnswersRecieved] = useState(0);
  const totalPlayers = useAppSelector((state) => state.game.players.length);

  useSocketEvent(socket, "answerRecieved", (data: { playerId: string; totalAnswers: number }) => {
    const { playerId, totalAnswers } = data;
    console.log("totalAnswers: ", totalAnswers);
    setAnswersRecieved(totalAnswers);
  });

  useSocketEvent(socket, "allPlayersAnswered", (randomizedAnswers: Game["latestAnswers"]) => {
    console.log("randomizedAnswers: ", randomizedAnswers);
    dispatch(setAnswers(randomizedAnswers));
    dispatch(setCurrentStage("Voting"));
  });

  if (!socket) return <div className="text-center text-red-500 font-bold">Socket is undefined</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Answer Submitted</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Question:</h2>
        <p className="text-lg text-gray-700">{question}</p>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600">Waiting for other players to answer...</p>
        <h2 className="text-black">
          {answersRecieved} / {totalPlayers}
        </h2>
        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );
};

export default AwaitingResponses;
