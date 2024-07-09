import { Socket } from "socket.io";
import { getRoom } from "../utils";

export function handleMessage(socket: Socket, io: any) {
  socket.on("sendMessage", (message: string) => {
    const room = getRoom(socket);
    io.to(room).emit("newMessage", message);
  });
}

export function handleJoinChat(socket: Socket) {
  socket.on("joinChat", (roomId: string) => {
    socket.join(roomId);
  });
}

// Other chat-related handlers...
