import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();
    const server = createServer(app);
    const io = new Server(server);

    const rooms: Rooms = {};
    
    io.on('connection', (socket) => {
        console.log('a user connected');

        // listen for the createRoom event
        socket.on('createRoom', (room) => {
        console.log('room created: ', room);
        rooms[room.code] = room;
        io.emit('roomCreated');
        });

        // listen for the joinRoom event
        socket.on('joinRoom', (code) => {







        socket.on('disconnect', () => {
        console.log('user disconnected');
        });
    });
    
    app.all('*', (req, res) => {
        return nextHandler(req, res);
    });
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err?: Error) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});