// server/src/utils.ts

import { Socket } from "socket.io";

export function getRoom(socket: Socket): number {
  const room = Number(Array.from(socket.rooms)[1]);
  if (isNaN(room)) {
    console.log("getRoom failed", socket.rooms);
    return -1;
  } else {
    return room;
  }
}

export function generateUniqueRoomCode(games: Record<number, any>): number {
  let gameCode: number;
  do {
    gameCode = Math.floor(1000 + Math.random() * 9000);
  } while (gameCode in games);
  return gameCode;
}

export function leaveAllGameRooms(socket: Socket) {
  for (const room of Array.from(socket.rooms)) {
    if (room !== socket.id) {
      socket.leave(room);
    }
  }
}

export function getRandomQuestion(prompts: string[]): string {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// timer utils
