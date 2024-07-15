import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import next from "next";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import { getRoom, generateUniqueRoomCode, getRandomQuestion, leaveAllGameRooms } from "./utils";
import { current } from "@reduxjs/toolkit";
import { startTimer, cancelTimer } from "./utils/timerManager";
const scorePerVote = 100;

interface PlayerConnection {
  socketId: ID;
  GameId: ID | null;
}
const playerConnections: Map<ID, PlayerConnection> = new Map();

export const gameTimers: { [gameRoom: string]: NodeJS.Timeout } = {};

interface CustomSocket extends Socket {
  playerId: string;
}

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const hostname = "localhost";
const PORT = process.env.PORT || 3000; // process.env.PORT is for Heroku

function getSocketIdFromPlayerId(playerId: ID) {
  console.log("playerConnections: ", playerConnections);
  const playerConnection = playerConnections.get(playerId);
  if (playerConnection) {
    return playerConnection.socketId;
  }
  return null;
}

app.prepare().then(() => {
  console.log("Node app prepared");
  //   const app = express();
  //   const server = createServer(app);
  //   const io = new Server(server);
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  const games: Games = {};

  //   io.use(wildcard());
  io.on("connection", (socket) => {
    console.log("a user connected (server)", socket.id);

    // update playerID socketID map
    let playerId = socket.handshake.auth.playerId;
    console.log("playerId on connection: ", playerId);

    if (playerId) {
      playerConnections.set(playerId, {
        socketId: socket.id,
        GameId: null,
      });
      console.log("playerId set: ", playerId, " socketId: ", socket.id);
      console.log("playerConnections: ", playerConnections);
    }

    function generatePlayerId() {
      let playerId;
      playerId = uuidv4();
      // Associate the player ID with the socket
      socket.data.playerId = playerId;
      // add player to playerConnections
      playerConnections.set(playerId, {
        socketId: socket.id,
        GameId: null,
      });
      console.log("playerId created: ", playerId, " socketId: ", socket.id);
      console.log("playerConnections: ", playerConnections);
      socket.emit("playerId", playerId);
      return playerId;
    }

    function logSocketsInRoom(roomName: string) {
      const rooms = io.sockets.adapter.rooms;
      const room = rooms.get(roomName);

      if (room) {
        console.log(`Sockets in room ${roomName}:`);
        Array.from(room).forEach((socketId) => {
          console.log(socketId);
        });
      } else {
        console.log(`Room ${roomName} does not exist or is empty.`);
      }
    }

    function logAllRooms() {
      console.log("All rooms and their sockets:");
      Array.from(io.sockets.adapter.rooms).forEach(([roomName, room]) => {
        console.log(`Room: ${roomName}`);
        Array.from(room).forEach((socketId) => {
          console.log(`  Socket: ${socketId}`);
        });
      });
    }

    // for testing ping pong
    socket.on("ping", () => {
      console.log("ping received");
      socket.emit("pong");
    });

    // Create Game
    socket.on("createGame", (gameSettings: GameSettings, player: Player) => {
      player.id = generatePlayerId();
      console.log("gameSettings: ", gameSettings);
      console.log("player: ", player);

      // generate a room code
      const gameCode: number = generateUniqueRoomCode(games);
      // create a new room
      const game: Game = {
        code: gameCode,
        gameSettings: gameSettings,
        players: [player],
        latestAnswers: {},
        gameActive: false,
        currentStage: "Answering",
        currentRound: 1,
        currentQuestion: "",
        timeRemaining: 0,
        chatHistory: [],
      };
      // add game to games
      games[gameCode] = game;
      // ensure removal of past games
      leaveAllGameRooms(socket);
      // join game on socket
      socket.join(gameCode.toString());
      console.log("rooms", Array.from(socket.rooms));
      // emit room to client
      console.log("game created: ", game);
      socket.emit("gameCreated", game);
    });

    // Start Game
    socket.on("startGame", () => {
      console.log("game started");
      console.log("rooms", Array.from(socket.rooms));
      // Get the rooms this socket is in
      const gameRoom = getRoom(socket);
      console.log("game room: ", gameRoom);

      if (gameRoom) {
        logAllRooms();
        // update game in games
        // Get the game object
        const game = games[gameRoom]; // creates reference
        // Set game to active
        game.gameActive = true;
        // Set current stage to answering
        game.currentStage = "Answering";
        // Set current round to 1
        game.currentRound = 1;
        // Set current question to getCurrentQuestion
        game.currentQuestion = getRandomQuestion(game.gameSettings.promptDeck);
        // Set latest answers to empty object
        game.latestAnswers = {};
        // set time remaining to timePerQuestion
        game.timeRemaining = game.gameSettings.timePerQuestion;

        // Send first question to all players in the game room
        io.to(gameRoom.toString()).emit("gameUpdate", { game: game, action: "startGame" });
        // start timer
        startTimer(game, game.gameSettings.timePerQuestion, gameRoom, () => {
          // RIGHT HERE FOR CHECKING IF ENOUGH ANSWERS
          const playerCount = game.players.length;
          const answerCount = Object.keys(game.latestAnswers).length;
          if (playerCount === 1 || answerCount >= 2) {
            prepareVotingStage(game);
          }
        });
      } else {
        console.error("Socket is not in any game room");
      }
    });

    function checkAndResetTimer(game: Game) {
      const gameRoom: number = game.code;
      const playerCount = game.players.length;
      const answerCount = Object.keys(game.latestAnswers).length;
    
      if (playerCount === 1 || answerCount >= 2) {
        prepareVotingStage(game);
      } else {
        // Not enough answers, reset the timer
        game.timeRemaining = game.gameSettings.timePerQuestion;
        io.to(gameRoom.toString()).emit("gameUpdate", { 
          game: game, 
          action: "resetAnsweringTime",
        });
        // Restart the timer
        startTimer(game, game.gameSettings.timePerQuestion, gameRoom, () => {
          checkAndResetTimer(game);
        });
      }
    }

    // Join Game
    socket.on("joinGame", (data: { code: number; player: Player }) => {
      const { code, player } = data;
      player.id = generatePlayerId();
      console.log("code", code);
      console.log("player", player);
      console.log("join game, code: ", code, " id: ", player.id);
      // check if game exists
      if (code in games) {
        // check if name is already taken
        const isNameTaken = games[code].players.some((p) => p.name.toLowerCase() === player.name.toLowerCase());
        if (isNameTaken) {
          // emit error to client if name is taken
          console.log("name already taken: ", player.name);
          socket.emit("nameTaken");
        } else {
          // add player to game
          games[code].players.push(player);
          // join game on socket
          socket.join(code.toString());
          // emit new players to all clients in game
          console.log("add player to game: ", player.name);
          io.to(code.toString()).emit("addPlayer", player);
          // emit to client
          console.log("valid code: ", games[code]);
          socket.emit("validCode", games[code]);
        }
      } else {
        // emit error to client
        console.log("invalid code: ", code);
        socket.emit("invalidCode");
      }
    });

    // kick player
    socket.on("kickPlayer", (data: { playerId: ID }) => {
      const playerId = data.playerId;
      const gameRoom = getRoom(socket);
      const game = games[gameRoom];

      // check if player exists
      const playerExists = game.players.some((player) => player.id === playerId);
      if (playerExists) {
        // remove player from game
        game.players = game.players.filter((player) => player.id !== playerId);
        // emit player removed to all clients in game
        io.to(gameRoom.toString()).emit("gameUpdate", game);
      }
    });

    // leave game
    socket.on("leaveGame", (data: { playerId: ID }) => {
      const gameRoom = getRoom(socket);
      const game = games[gameRoom];
      // check if host
      const playerId = data.playerId;
      const player = game.players.find((player) => player.id === playerId);
      if (player && player.isHost) {
        // remove game
        delete games[gameRoom];
        // emit game removed to all clients in game
        io.to(gameRoom.toString()).emit("gameRemoved");
      } else {
        // remove player from game
        // console.log("before player leaving: ", game.players)
        game.players = game.players.filter((player) => player.id !== playerId);
        // console.log("after player leaving: ", game.players)
        // emit player removed to all clients in game
        io.to(gameRoom.toString()).emit("gameUpdate",  { game: game, action: "playerLeft" });
      }
      // leave game room
      socket.leave(gameRoom.toString());
    })

    // next round
    socket.on("nextRound", () => {
      const gameRoom = getRoom(socket);
      const game = games[gameRoom];
      // increment round
      game.currentRound++;
      // get next question
      const question = getRandomQuestion(game.gameSettings.promptDeck);
      // set current question
      game.currentQuestion = question;
      // set current stage to answering
      game.currentStage = "Answering";
      // reset latest answers
      game.latestAnswers = {};
      // send updated game to all players
      io.to(gameRoom.toString()).emit("gameUpdate", { game: game, action: "nextRound" });
    });

    // request game update
    socket.on("requestGameUpdate", (code: number) => {
      // console.log('game update requested', games);

      if (code in games) {
        // emit game update to client
        // console.log('game update: ', games[code])
        const game = games[code];
        socket.emit("gameUpdate", { game: game, action: "requestGameUpdate" });
      } else {
        console.log("game no longer active ", code);
        socket.emit("gameNotActive");
      }
    });

    // submit answer
    socket.on("submitAnswer", (data: { currentPlayerId: ID; answer: string }) => {
      console.log(data);
      console.log("submit answer: ", data.answer);
      console.log("current player id: ", data.currentPlayerId);
      const playerId = data.currentPlayerId;
      const answer = { text: data.answer, submittedBy: playerId, votes: [] };
      console.log(answer);
      const gameRoom: number = getRoom(socket);
      const game = games[gameRoom];
      // store the answer
      game.latestAnswers[playerId] = answer;

      // check if all players have answered
      console.log("game.latestAnswers", game.latestAnswers);
      console.log("game.players: ", game.players);
      const allPlayersAnswered = game.players.every((player) => {
        const playerAnswered = player.id in game.latestAnswers;
        console.log(`Player ${player.id} answered: `, playerAnswered);
        return playerAnswered;
      });
      const totalAnswers = Object.keys(game.latestAnswers).length;

      io.to(gameRoom.toString()).emit("answerRecieved", { playerId, totalAnswers });

      // if all players have answered, move to next stage
      console.log("all players answered: ", allPlayersAnswered);
      if (allPlayersAnswered) {
        prepareVotingStage(game);
      }
    });

    function prepareVotingStage(game: Game) {
      const allAnswers = Object.values(game.latestAnswers);

      // Shuffle the array
      const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

      // Create a new object with numeric keys for the shuffled answers
      const randomizedAnswers = shuffledAnswers.reduce((acc, answer, index) => {
        acc[index] = answer;
        return acc;
      }, {} as LatestAnswers);

      // Update game stage
      game.currentStage = "Voting";
      // update game with randomized answers
      game.latestAnswers = randomizedAnswers;
      // set time remaining to timePerVote
      game.timeRemaining = game.gameSettings.timePerVote;

      // emit updated game to all players
      io.to(game.code.toString()).emit("gameUpdate", { game: game, action: "allPlayersAnswered" });
      // start timer
      startTimer(game, game.gameSettings.timePerVote, game.code, () => {
        prepareResultsStage(game);
        console.log("time over voting");
      });
    }

    function prepareResultsStage(game: Game) {
      // Calculate scores
      const newScores: { [playerId: ID]: number } = {};

      Object.entries(game.latestAnswers).forEach(([playerId, answer]) => {
        newScores[playerId] = answer.votes.length * scorePerVote;
      });

      // Update player scores
      game.players.forEach((player) => {
        if (newScores[player.id] !== undefined) {
          player.score += newScores[player.id];
        }
      });
      // change stage to results
      game.currentStage = "Results";

      io.to(game.code.toString()).emit("gameUpdate", { game: game, action: "allPlayersVoted" });
      // start timer
      startTimer(game, game.gameSettings.timePerResults, game.code, () => {
        game.timeRemaining = game.gameSettings.timePerResults;
        game.currentStage = "Score";
        io.to(game.code.toString()).emit("gameUpdate", { game: game, action: "timeOverResults" });
      });
    }

    // vote for answer
    socket.on("submitVote", (data: { currentPlayerId: ID; answerAuthor: ID }) => {
      const voterId = data.currentPlayerId; // voter
      const answerAuthor = data.answerAuthor; // vote
      const gameRoom: number = getRoom(socket);
      const game = games[gameRoom];
      console.log("submitVote game: ", game);
      // Find the answer
      const answer = Object.values(game.latestAnswers)
        .flat()
        .find((a) => a.submittedBy === answerAuthor);
      // check if vote has already gone through and if not add it
      if (answer && !answer.votes.includes(voterId)) {
        answer.votes.push(voterId);
      }

      // Check if all players have voted
      const totalVotes = Object.values(game.latestAnswers)
        .flat()
        .reduce((sum, a) => sum + a.votes.length, 0);
      console.log("latest answers: ", game.latestAnswers);
      const allPlayersVoted = totalVotes === game.players.length;
      console.log("all players voted: ", allPlayersVoted, totalVotes, game.players.length);
      io.to(gameRoom.toString()).emit("voteReceived", { voterId, totalVotes });

      if (allPlayersVoted) {
        prepareResultsStage(game);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      // remove player from playerConnections
      const playerConnection = playerConnections.get(playerId);
      if (playerConnection) {
        playerConnections.delete(playerId);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(PORT, () => {
      console.log(`> Ready on http://${hostname}:${PORT}`);
    });
});
