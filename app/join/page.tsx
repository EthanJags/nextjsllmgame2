"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket, initSocket } from "../functions/socketManager";
import { resetGame, setGame } from "../store/slices/gameSlice";

export default function Join() {
  const router = useRouter();
  const player = useAppSelector((state) => state.player);
  const socket = getSocket();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketID = useAppSelector((state) => state.socket.id);

  useEffect(() => {
    console.log('socketID: ', socketID);
    if (socketID && player.name) {
      const socket = initSocket(socketID);
      console.log("Socket: ", socket);
      console.log("Player: ", player);
      setIsLoading(false);
    } else {
      router.push("/");
    }

    if (socket) {
      const handleValidCode = (game: Game) => {
        setIsSubmitting(false);
        dispatch(setGame(game));
        router.push(`/waitingRoom?code=${game.code}`);
      };

      const handleInvalidCode = () => {
        setIsSubmitting(false);
        setError("Invalid code. Please try again.");
        setCode("");
      };

      socket.off("validCode");
      socket.off("invalidCode");

      socket.on("validCode", handleValidCode);
      socket.on("invalidCode", handleInvalidCode);

      return () => {
        socket.off("validCode", handleValidCode);
        socket.off("invalidCode", handleInvalidCode);
      };
    }
  }, [player.name, socket, dispatch, router, socketID]);

  const handleSubmit = () => {
    if (!socket) return;
    setError("");
    setIsSubmitting(true);
    console.log("Code: ", code);
    console.log("Player: ", player);
    socket.emit("joinGame", { code, player });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome, {player.name}!</h1>
      <div style={styles.inputContainer}>
        <input
          type="number"
          id="codeInput"
          value={code}
          style={styles.input}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here"
          disabled={isSubmitting}
        />
        <button 
          onClick={handleSubmit} 
          style={styles.button} 
          disabled={isSubmitting || code.length === 0}
        >
          {isSubmitting ? "Joining..." : "Join Game"}
        </button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: '100%',
    maxWidth: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: 'black',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};