import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector, useAppDispatch } from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Results: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const latestAnswers = useAppSelector((state) => state.game.latestAnswers);
  const players = useAppSelector((state) => state.game.players);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleMoveToScores();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const handleMoveToScores = () => {
    dispatch(setCurrentStage("Score"));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Results</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Question:</h2>
        <p className="text-lg text-gray-700">{question}</p>
      </div>

      <div className="space-y-6">
        {Object.entries(latestAnswers).map(([playerId, answer]) => (
          <div key={`${playerId}`} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">Answer: {answer.text}</h3>
            <p className="text-gray-600 mb-2">Submitted by: {getPlayerName(answer.submittedBy)}</p>
            <p className="text-gray-600 mb-2">Votes: {answer.votes.length}</p>
            {answer.votes.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Voted by:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {answer.votes.map((voterId) => (
                    <li key={voterId}>{getPlayerName(voterId)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600">
          Moving to scores in <span className="font-bold text-indigo-600">{timeLeft}</span> seconds
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          ></div>
        </div>
      </div>
      <button
        onClick={handleMoveToScores}
        className="mt-6 px-6 py-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Move to Scores
      </button>
    </div>
  );
};

export default Results;
