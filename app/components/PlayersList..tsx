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
    return <div>No players</div>;
  }

  const playerArray = Object.values(players);

  return (
    <div>
      <h1>Players:</h1>
      <ul>
        {playerArray.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}
