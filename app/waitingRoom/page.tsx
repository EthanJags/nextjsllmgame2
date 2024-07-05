"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useAppDispatch } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { setGame, addPlayer, setCurrentQuestion } from "../store/slices/gameSlice";


export default function WaitingRoom() {
  const router = useRouter();
  const socket = getSocket();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const game = useSelector((state: RootState) => state.game);
  const socketID = useSelector((state: RootState) => state.socket.id);
  const [linkCopied, setLinkCopied] = useState(false);


  useEffect(() => {
    console.log("Waiting Room mounted");
    console.log('socketID: ', socketID);
    console.log("Player: ", player);
    if (socketID && player.name) {
      // reinitialize socket
      const socket = initSocket(socketID);
      console.log("Socket: ", socket);
      setIsLoading(false);
    
    // check for game updates
    console.log("Requesting game update", game.code)
    socket.emit("requestGameUpdate", game.code);

    // if code is valid
    socket.on("gameUpdate", (game: Game) => {
      console.log("Game Update: ", game);
      dispatch(setGame(game));
    });

    // if code is invalid
    socket.once("gameNotActive", () => {
      console.log("Game no longer active");
      alert("Game no longer active")
      router.push("/");
    })

    // add Player
    socket.on("addPlayer", (player: Player) => {
      console.log("Player added: ", player);
      dispatch(addPlayer(player));
    });

    // listener for acknocledgement of backend
  socket.once("gameStarted", (question: string) => {
    dispatch(setCurrentQuestion(question));
    // redirect to game page
    router.push(`/game`);
  });

    // Cleanup function
  return () => {
    socket.off("gameUpdate");
    socket.off("gameNotActive");
    socket.off("addPlayer")
    socket.off("gameStarted");
  };
} else {
  router.push("/");
}
  
  }, []);

if (isLoading) {
    return <h1>Loading...</h1>;
}

const handleStartClick = () => {
  if (!socket) return;
  // emit start game event
  socket.emit("startGame");
}

const handleShareLink = () => {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 4000); // Reset after 2 seconds
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

  return (
    <div>
      <h1>Waiting Room</h1>
      <h1>Enter Code: {game.code} to join</h1>
        <h2>Welcome {player.name}</h2>
        <PlayersList/>
        {player.isHost && <button onClick={handleStartClick}>Start Game</button>}
        <button 
        onClick={handleShareLink}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {linkCopied ? 'Link Copied!' : 'Share Link'}
      </button>
    </div>
  )};