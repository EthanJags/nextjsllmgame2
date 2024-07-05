"use client";

import { useState, useEffect, use } from "react";
import io, { Socket } from "socket.io-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import PlayersList from "../components/PlayersList.";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";
import { getSocket } from "../functions/socketManager";
import Answering from "../components/gameScreens/Answering";
import AwaitingResponses from "../components/gameScreens/AwaitingResponses";
import { time } from "console";
import TimerBar from "../components/TimerBar/TimerBar";
import { setCurrentStage } from "../store/slices/gameSlice";
import Choosing from "../components/gameScreens/Choosing";


export default function Game() {
  const router = useRouter();
  const socket = getSocket();
  if (!socket) {
    return <h1>Socket is undefined</h1>;
  }
  const player = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const game = useAppSelector((state) => state.game);
const currentStage = useAppSelector((state) => state.game.currentStage);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [timerActive, setTimerActive] = useState<boolean>(false);
    const [totalTime, setTotalTime] = useState<number>(0);
const setTime = (time: number) => {
    setTimeRemaining(time);
    setTotalTime(time)
    setTimerActive(true);
  }

  const fetchQuestion = () => {
    if (!socket) return;
    socket.emit("requestQuestion", { gameCode: game.code });
  }

  useEffect(() => {
    console.log("current Stage: ", currentStage);
    }, [currentStage]);

  // GAME STATE ANSWERING
 
//     useEffect(() => {
//     if (!player || !socket || !game) {
//       router.push("/");
//     } else {
//         fetchQuestion();

//         socket.on("recieveQuestion", (question: string, time: number) => {
//             console.log("recieved question: ", question);
//             setQuestion(question);
//             setTime(time);
//             setIsLoading(false);
//         });

//         return () => {
//           socket.off("recieveQuestion");
//         };
//     }
// }, [player, game, socket]);

// TIMER LOGIC
useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            dispatch(setCurrentStage('AwaitingResponses'));
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, socket, game.code]);


if (isLoading) {
    return <h1>Loading...</h1>;
}

  return (
    <div>
      <h1>Game</h1>
      {currentStage === 'Answering' && <Answering socket={socket}/>}
      {currentStage === 'AwaitingResponses' && <AwaitingResponses socket={socket}/>}
      {currentStage === 'Choosing' && <Choosing socket={socket}/>}
        <TimerBar timeRemaining={timeRemaining} totalTime={totalTime} />
    </div>
  )};