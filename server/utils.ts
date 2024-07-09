// server/src/utils.ts

import { Socket } from "socket.io";

export function getRoom(socket: Socket): number {
  return Number(Array.from(socket.rooms)[1]);
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

// Add any other utility functions you need
