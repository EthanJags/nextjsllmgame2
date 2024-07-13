import React, { useEffect } from "react";
import { useAppSelector } from "../store/constants/reduxTypes";

export default function PlayersList() {
  const players = useAppSelector((state) => state.game.players);

  useEffect(() => {
    console.log("PlayersList mounted");
    console.log(players);
    return () => {
      console.log("PlayersList unmounted");
    };
  });

  if (players === undefined) {
    return <div className="text-center text-gray-500">No players yet</div>;
  }

  const playerArray = Object.values(players);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3 text-primary-dark">Players:</h2>
      <ul className="bg-gray-50 rounded-md shadow-sm">
        {playerArray.map((player, index) => (
          <li
            key={player.id}
            className={`px-4 py-2 flex items-center ${
              index !== playerArray.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <span className="text-gray-700">{player.name}</span>
            {player.isHost && <span className="ml-2 text-sm text-gray-500">(Host)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
