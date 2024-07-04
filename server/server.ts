import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import prompts from 'prompts/prompts';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

const hostname = "localhost";
const port = 3000;


app.prepare().then(() => {
    console.log("Node app prepared")
//   const app = express();
//   const server = createServer(app);
//   const io = new Server(server);
const httpServer = createServer(handler);
const io = new Server(httpServer);

  const games: Games = {};


  // Function to generate a unique room code
function generateUniqueRoomCode(): number {
    let gameCode: number;
    do {
      gameCode = Math.floor(1000 + Math.random() * 9000);
    } while (gameCode in games);
    return gameCode;
  }

  function leaveAllGameRooms(socket: Socket) {
    for (const room of Array.from(socket.rooms)) {
      if (room !== socket.id ) {
        socket.leave(room);
      }
    }
  }

  // return random question from prompts
    function getRandomQuestion(): string {
        const question = prompts[Math.floor(Math.random() * prompts.length)];
        return question;
    }

//   io.use(wildcard());
  io.on('connection', (socket) => {
    console.log('a user connected (server)');
    // generate player id
    const playerId = uuidv4();
    socket.emit('player_id', playerId)
    console.log('server Player ID: ', playerId)

    // Create Game
    socket.on('createGame', (gameSettings: GameSettings, player: Player) => {
    console.log('gameSettings: ', gameSettings);
    console.log('player: ', player);
        // generate a room code
    const gameCode: number = generateUniqueRoomCode();
    // create a new room
    const game: Game = {
        code: gameCode,
        gameSettings: gameSettings,
        players: [player],
        highScore: 0,
        highScorePlayer: null,
        };
    // add game to games
    games[gameCode] = game;
    // ensure removal of past games
    leaveAllGameRooms(socket);
    // join game on socket
    socket.join(gameCode.toString());
    console.log('rooms', Array.from(socket.rooms));
    // emit room to client
    console.log('game created: ', game);
    socket.emit('gameCreated', game);
    });
    
    // Start Game
socket.on('startGame', () => {
    console.log('game started');
    
    // Get the rooms this socket is in
    const gameRoom = Array.from(socket.rooms)[1];
    
    if (gameRoom) {
      // Send first question to all players in the game room
      io.to(gameRoom).emit('gameStarted', 'What is the capital of France?');
    } else {
      console.error('Socket is not in any game room');
    }
  });

    // Join Game
    socket.on('joinGame', (data: { code: number, player: Player }) => {
        const { code, player } = data
        console.log('code', code)
        console.log('player', player)
        console.log('join game, code: ', code, ' id: ', player.id);
        // check if game exists
        if (code in games) {
            // add player to game
            games[code].players.push(player);
            // join game on socket
            socket.join(code.toString());
            // emit new players to all clients in game
            console.log('add player to game: ', player.name);
            io.to(code.toString()).emit('addPlayer', player);
            // emit to client
            console.log('valid code: ', games[code]);
            socket.emit('validCode', games[code]);
        } else {
            // emit error to client
            console.log('invalid code: ', code);
            socket.emit('invalidCode');
        }
        });

    // request game update
    socket.on('requestGameUpdate', (code: number) => {
        // console.log('game update requested', games);

        if (code in games) {
            // emit game update to client
            // console.log('game update: ', games[code])
            socket.emit('gameUpdate', games[code]);
        } else {
            console.log('game no longer active ', code);
            socket.emit('gameNotActive');
        }
        });


























    socket.on('disconnect', () => {
      console.log('user disconnected');
      // Additional logic to handle player disconnection
    });
  });



  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});