import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  useAppDispatch,
  useAppSelector,
} from "@/app/store/constants/reduxTypes";
import { useSocketEvent } from "@/app/functions/useSocketEvent";
import {
  setAnswers,
  setCurrentStage,
  setPlayers,
} from "@/app/store/slices/gameSlice";

interface Answer {
  text: string;
  submittedBy: string;
  votes: string[];
}

interface LatestAnswers {
  [playerId: string]: Answer[];
}

const AwaitingVotes: React.FC<{
  socket: Socket;
}> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const question = useAppSelector((state) => state.game.currentQuestion);
  const [votesReceived, setVotesReceived] = useState(0);
  const totalPlayers = useAppSelector((state) => state.game.players.length);

  useSocketEvent(socket, "voteReceived", () => {
    setVotesReceived((prev) => prev + 1);
  });

  useSocketEvent(
    socket,
    "allPlayersVoted",
    (results: {
      latestAnswers: Game["latestAnswers"];
      scores: Game["players"];
    }) => {
      dispatch(setAnswers(results.latestAnswers));
      dispatch(setPlayers(results.scores));
      dispatch(setCurrentStage("Results"));
    },
  );

  if (!socket) return <h1>Socket is undefined</h1>;

  return (
    <div>
      <h1>Waiting for Votes</h1>
      <h2>Question: {question}</h2>
      <p>
        Votes received: {votesReceived} / {totalPlayers}
      </p>
      <div className="loading-indicator">Loading...</div>
    </div>
  );
};

export default AwaitingVotes;
