import { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const setSocket = (newSocket: Socket): void => {
  socket = newSocket;
};

export const getSocket = (): Socket | null => socket;