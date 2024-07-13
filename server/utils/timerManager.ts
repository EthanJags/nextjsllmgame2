// timerManager.ts

import { Server } from "socket.io";
import { gameTimers } from "../server"; // Import gameTimers from the main file

export function startTimer(
  game: Game,
  duration: number,
  //   io: Server,
  gameRoom: number,
  handleTimerEnd: () => void,
) {
  if (gameTimers[gameRoom]) {
    clearInterval(gameTimers[gameRoom]);
  }

  game.timeRemaining = duration;

  gameTimers[gameRoom] = setInterval(() => {
    game.timeRemaining--;

    if (game.timeRemaining <= 0) {
      clearInterval(gameTimers[gameRoom]);
      delete gameTimers[gameRoom];
      handleTimerEnd();
    } else {
      // Emit time update to clients
      //   io.to(gameRoom).emit("timeUpdate", game.timeRemaining);
    }
  }, 1000);
}

export function cancelTimer(gameRoom: string) {
  if (gameTimers[gameRoom]) {
    clearInterval(gameTimers[gameRoom]);
    delete gameTimers[gameRoom];
  }
}

// ... other timer-related functions
