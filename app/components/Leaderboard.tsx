import React from "react";

const Leaderboard: React.FC<{ players: Game["players"] }> = ({ players }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul className="leaderboard-list">
        {sortedPlayers.map((player, index) => (
          <li key={player.id} className="leaderboard-item">
            <span className="rank">{index + 1}</span>
            <span className="player-name">{player.name}</span>
            <span className="player-score">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
