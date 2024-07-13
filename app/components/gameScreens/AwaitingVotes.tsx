import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import { setAnswers, setCurrentStage, setPlayers } from "@/app/store/slices/gameSlice";

const AwaitingVotes: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const [votesReceived, setVotesReceived] = useState(0);
  const totalPlayers = useAppSelector((state) => state.game.players.length);

  useSocketEvent(socket, "voteReceived", (data: { voterId: string; totalVotes: number }) => {
    const { totalVotes } = data;
    setVotesReceived(totalVotes);
  });

  useSocketEvent(
    socket,
    "allPlayersVoted",
    (results: { players: Game["players"]; latestAnswers: Game["latestAnswers"] }) => {
      dispatch(setAnswers(results.latestAnswers));
      dispatch(setPlayers(results.players));
      dispatch(setCurrentStage("Results"));
    },
  );

  if (!socket) return <div className="text-center text-red-500 font-bold">Socket is undefined</div>;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Waiting for Votes</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Question:</h2>
        <p className="text-lg text-gray-700">{question}</p>
      </div>
      <div className="text-center">
        <p className="text-xl mb-4 text-gray-600">
          Votes received: <span className="font-bold text-indigo-600">{votesReceived}</span> / {totalPlayers}
        </p>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              style={{ width: `${(votesReceived / totalPlayers) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>
        <div className="mt-6 text-gray-600">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
          Waiting for all votes...
        </div>
      </div>
    </div>
  );
};

export default AwaitingVotes;
