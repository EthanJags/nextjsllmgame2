import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { v4 as uuidv4 } from 'uuid';
// import prompts from 'prompts/prompts';

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
    // games[gameCode] = game;
        // emit room to client
    socket.emit('gameCreated', game);
    });
    
    // Start Game
    socket.on('startGame', () => {
      console.log('game started');
      // send first question to all players
      socket.emit('gameStarted', 'What is the capital of France?');
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
            // emit new players to all clients in game

            // emit to client
            console.log('valid code: ', games[code]);
            socket.emit('validCode', games[code]);
        } else {
            // emit error to client
            console.log('invalid code: ', code);
            socket.emit('invalidCode');
        }
        });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      // Additional logic to handle player disconnection
    });
  });

  // Join Game

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});