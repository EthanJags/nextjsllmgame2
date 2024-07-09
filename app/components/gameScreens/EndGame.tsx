// components/EndGame.tsx
import React from "react";
import { useAppSelector } from "@/app/store/constants/reduxTypes";
import Leaderboard from "../Leaderboard";

const EndGame: React.FC = () => {
  const game = useAppSelector((state) => state.game);

  return (
    <div className="end-game-container">
      <h1>Game Over</h1>
      <p>Thanks for playing!</p>
      <Leaderboard players={game.players} />
      {/* add play again functionality that links to the waiting room */}
    </div>
  );
};

export default EndGame;
