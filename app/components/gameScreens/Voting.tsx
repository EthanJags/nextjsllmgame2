import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Voting: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const latestAnswers = useAppSelector((state) => state.game.latestAnswers);
  const currentPlayerId = useAppSelector((state) => state.player.id);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  if (!socket) return <div className="text-center text-red-500 font-bold">Socket is undefined</div>;

  const handleSubmit = () => {
    if (selectedAnswerId && socket) {
      socket.emit("submitVote", { currentPlayerId: currentPlayerId, answerAuthor: selectedAnswerId });
      dispatch(setCurrentStage("AwaitingVotes"));
    }
  };

  // Filter out the current player's answer
  const filteredAnswers = Object.entries(latestAnswers).filter(([_, answer]) => answer.submittedBy !== currentPlayerId);

  const answerOptions = filteredAnswers.map(([playerId, answer]) => (
    <button
      key={`${playerId}`}
      onClick={() => setSelectedAnswerId(answer.submittedBy)}
      className={`w-full p-4 mb-3 text-left rounded-lg transition-colors duration-200 ${
        selectedAnswerId === answer.submittedBy
          ? "bg-indigo-100 border-2 border-indigo-500"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {answer.text}
    </button>
  ));

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Vote for an Answer</h1>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Question:</h2>
        <p className="text-lg text-gray-700 mb-6">{question}</p>
        <div className="space-y-2">
          {answerOptions.length > 0 ? (
            answerOptions
          ) : (
            <p className="text-center text-gray-500 font-semibold">No answers to vote on</p>
          )}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedAnswerId}
        className={`px-6 py-3 rounded-lg font-bold text-white transition-colors duration-200 ${
          selectedAnswerId ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default Voting;
