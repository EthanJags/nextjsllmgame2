import React, { useEffect } from "react";
import { useAppSelector } from "@/app/store/constants/reduxTypes";
import { setCurrentStage, incrementRound } from "@/app/store/slices/gameSlice";
import { useAppDispatch } from "@/app/store/constants/reduxTypes";
import Leaderboard from "../Leaderboard";

const Score: React.FC = () => {
  const dispatch = useAppDispatch();
  const players = useAppSelector((state) => state.game.players);
  const currentRound = useAppSelector((state) => state.game.currentRound);
  const maxRounds = useAppSelector((state) => state.game.gameSettings.rounds);

  // Automatically move to either end game or next round after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(incrementRound());
      // If we've reached the end of the game, go to the end screen
      if (currentRound < maxRounds) {
        dispatch(setCurrentStage("Answering"));
      } else {
        dispatch(setCurrentStage("End"));
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [dispatch]);

  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="score-container">
      <h1>Scores</h1>
      <Leaderboard players={players} />
    </div>
  );
};

export default Score;
