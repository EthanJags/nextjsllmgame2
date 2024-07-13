import React, { use } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../store/constants/reduxTypes";

interface PlayerInfoProps {
  players: Game["players"];
  socket: Socket;
  currentPlayerId: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ players, socket, currentPlayerId }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentPlayer = useAppSelector((state) => state.player);

  const handleKickPlayer = (playerId: string) => {
    socket.emit("kickPlayer", playerId);
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Players</h2>
      <ul className="space-y-2">
        {sortedPlayers.map((player) => (
          <li
            key={player.id}
            className="flex items-center justify-between p-3 rounded-lg bg-background-light mode-dark:bg-background-dark"
          >
            <div className="flex items-center">
              <span className="font-semibold text-text">{player.name}</span>
              {player.isHost && <span className="ml-2 text-sm text-secondary">(Host)</span>}
            </div>
            <div className="flex items-center">
              <span className="font-bold text-primary mr-4">{player.score}</span>
              {currentPlayer.isHost && currentPlayer.id !== player.id && (
                <button 
                  onClick={() => handleKickPlayer(player.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm transition duration-300"
                >
                  Kick
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerInfo;