import React, { useState } from "react";
import { Socket } from "socket.io-client";
import {
  useAppDispatch,
  useAppSelector,
} from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Voting: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const latestAnswers = useAppSelector(
    (state) => state.game.latestAnswers,
  );
  const currentPlayerId = useAppSelector((state) => state.player.id);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  if (!socket) return <h1>Socket is undefined</h1>;

  const handleSubmit = () => {
    if (selectedAnswerId && socket) {
      socket.emit("submitVote", { submittedBy: selectedAnswerId });
      dispatch(setCurrentStage("AwaitingVotes"));
    }
  };

  const answerOptions = Object.entries(latestAnswers).map(([playerId, answer]) => (
    <button
      key={`${playerId}`}
      onClick={() => setSelectedAnswerId(answer.submittedBy)}
      className={selectedAnswerId === answer.submittedBy ? 'selected' : ''}
    >
      {answer.text}
    </button>
  ));

  return (
    <div>
      <h2>Question: {question}</h2>
      <h1>Vote for an Answer</h1>
      <div className="answer-options">
        {answerOptions.length > 0 ? (
          answerOptions
        ) : (
          <h1>No answers to vote on</h1>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!selectedAnswerId}
        className="submit-button"
      >
        Submit Vote
      </button>
    </div>
  );
};

export default Voting;
