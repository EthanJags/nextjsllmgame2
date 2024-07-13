import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import next from "next";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import prompts from "./prompts/prompts";
import { getRoom, generateUniqueRoomCode, getRandomQuestion, leaveAllGameRooms } from "./utils";
import { current } from "@reduxjs/toolkit";
const scorePerVote = 100;

interface PlayerConnection {
  socketId: ID;
  GameId: ID | null;
}
const playerConnections: Map<ID, PlayerConnection> = new Map();

interface CustomSocket extends Socket {
  playerId: string;
}

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const hostname = "localhost";
const port = 3000;

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
  const io = new Server(httpServer);

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
        game.currentQuestion = getRandomQuestion(prompts);
        // Set latest answers to empty object
        game.latestAnswers = {};
        // set time remaining to timePerQuestion
        game.timeRemaining = game.gameSettings.timePerQuestion;

        // Send first question to all players in the game room
        io.to(gameRoom.toString()).emit("gameUpdate", { game: game, action: "startGame" });

        
      } else {
        console.error("Socket is not in any game room");
      }
    });

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

    // next round
    socket.on("nextRound", () => {
      const gameRoom = getRoom(socket);
      const game = games[gameRoom];
      // increment round
      game.currentRound++;
      // get next question
      const question = getRandomQuestion(prompts);
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

    // request Question
    socket.on("requestQuestion", () => {
      console.log("request question");
      // Get the rooms this socket is in
      const gameRoom = getRoom(socket);
      // Get a random question
      const question = getRandomQuestion(prompts);
      // Send question to all players in the game room
      console.log("question: ", question);
      console.log("game room: ", gameRoom);
      const timePerQuestion = 60;
      io.to(gameRoom.toString()).emit("recieveQuestion", question, timePerQuestion);
      setTimeout(() => {
        io.to(gameRoom.toString()).emit("timeOver");
      }, timePerQuestion * 1000);
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
        // Get all answers as an array
        const allAnswers = Object.values(game.latestAnswers);

        //  Shuffle the array
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
        // emit updated game to all players
        io.to(gameRoom.toString()).emit("gameUpdate", { game: game, action: "allPlayersAnswered" });

        // // Send personalized answer sets to each player
        // game.players.forEach((player) => {
        //   const playerAnswers = randomizedAnswers.filter((a) => a.submittedBy !== player.id);
        //   const socketId = getSocketIdFromPlayerId(player.id);
        //   if (!socketId) {
        //     console.error("PlayerID not found in playerConnections");
        //     return;
        //   }
        //   io.to(socketId).emit("allPlayersAnswered", playerAnswers, game.gameSettings.timePerQuestion);
        // });

        // Start the timer for all players
        setTimeout(() => {
          io.to(gameRoom.toString()).emit("timeOver");
        }, game.gameSettings.timePerQuestion * 1000);
      }
    });

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

        // emit updated scores and latestAnswers to all players
        // io.to(gameRoom.toString()).emit(
        //   "allPlayersVoted",
        //   { players: game.players, latestAnswers: game.latestAnswers }
        // );
        io.to(gameRoom.toString()).emit("gameUpdate", { game: game, action: "allPlayersVoted" });
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
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
