import React, { useEffect } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "@/app/store/constants/reduxTypes";
import { setCurrentStage } from "@/app/store/slices/gameSlice";

const Results: React.FC = () => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const latestAnswers = useAppSelector((state) => state.game.latestAnswers);
  const players = useAppSelector((state) => state.game.players);

  // Automatically move to show the score after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setCurrentStage("Score"));
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [dispatch]);

  // Helper function to get player name from ID
  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };

  return (
    <div className="results-container">
      <h1>Results</h1>
      <h2>Question: {question}</h2>

      {Object.entries(latestAnswers).map(([playerId, answer]) =>
<div key={`${playerId}`} className="answer-container">
<h3>Answer: {answer.text}</h3>
<p>Submitted by: {getPlayerName(answer.submittedBy)}</p>
<p>Votes: {answer.votes.length}</p>
{answer.votes.length > 0 && (
  <div className="voters">
    <h4>Voted by:</h4>
    <ul>
      {answer.votes.map((voterId) => (
        <li key={voterId}>{getPlayerName(voterId)}</li>
      ))}
    </ul>
  </div>
)}
</div>

      )}
    </div>
  );
};

export default Results;
