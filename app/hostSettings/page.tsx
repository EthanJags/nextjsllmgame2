"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket } from "../functions/socketManager";
import { setGameSettings, addPlayer } from "../store/slices/gameSlice";


export default function HostSettings() {
  const router = useRouter();
  const socket = getSocket();
  const player = useAppSelector(state => state.player);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  // settings
  const [rounds, setRounds] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  useEffect(() => {
    console.log("Player: ", player);
    console.log("Socket: ", socket);
    if (!player.name || !socket || !player.isHost) {
      router.push("/");
    } else {
        setIsLoading(false);
    }
}, [player.name, socket]);

if (isLoading) {
    return <h1>Loading...</h1>;
}


  const handleStartClick = () => {
    if (!socket) return;
    // create gameSettings object
    const gameSettings: GameSettings = {
      rounds: rounds,
      timePerQuestion: timePerQuestion
    }
    console.log("Game Settings: ", gameSettings)

    // emit start game event
    socket.emit("createGame", gameSettings, player);

    // listener for game started, recieve room object
    socket.on("gameCreated", (game: Game) => {
      // save the room to redux
      dispatch(setGameSettings(game.gameSettings));
      dispatch(addPlayer(player));
      // redirect to game page
      router.push(`/waitingRoom?code=${game.code}`);
  });
}

  return (
    <div>
      <h1>Welcome, {player.name}!</h1>
      <h2>Game Settings</h2>
      <div>
        <label htmlFor="rounds">Number of Rounds:</label>
        <select 
          id="rounds" 
          value={rounds} 
          onChange={(e) => setRounds(Number(e.target.value))}
        >

          {[3, 5, 10, 15, 20].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="timePerQuestion">Time per Question (seconds):</label>
        <select 
          id="timePerQuestion" 
          value={timePerQuestion} 
          onChange={(e) => setTimePerQuestion(Number(e.target.value))}
        >
          {[15, 30, 45, 60, 90].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <button onClick={handleStartClick}>
        Start Game
      </button>
    </div>
  );


}
