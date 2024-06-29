import React from "react";

export default function PlayersList({ players }: Players) {
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
