import React from "react";

const Leaderboard: React.FC<{ players: Game["players"] }> = ({ players }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Leaderboard</h2>
      <ul className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <li
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0 ? "bg-yellow-100" : index === 1 ? "bg-gray-100" : index === 2 ? "bg-orange-100" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold ${
                  index === 0
                    ? "bg-yellow-400 text-yellow-800"
                    : index === 1
                      ? "bg-gray-400 text-gray-800"
                      : index === 2
                        ? "bg-orange-400 text-orange-800"
                        : "bg-indigo-400 text-indigo-800"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-semibold text-gray-800">{player.name}</span>
            </div>
            <span className="font-bold text-indigo-600">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
