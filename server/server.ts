import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io";
import prompts from "./prompts/prompts";
import {
  getRoom,
  generateUniqueRoomCode,
  getRandomQuestion,
  leaveAllGameRooms,
} from "./utils";
const scorePerVote = 100;

interface CustomSocket extends Socket {
  playerId: string;
}

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const hostname = "localhost";
const port = 3000;

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
    console.log("a user connected (server)");
    // generate player id
    const playerId = socket.id;
    socket.emit("player_id", playerId);
    console.log("server Player ID: ", playerId);

    // Create Game
    socket.on("createGame", (gameSettings: GameSettings, player: Player) => {
      console.log("gameSettings: ", gameSettings);
      console.log("player: ", player);
      
      // generate player id
      const playId = uuidv4();
      console.log("playId: ", playId);

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

      // Get the rooms this socket is in
      const gameRoom = getRoom(socket);

      if (gameRoom) {
        // Send first question to all players in the game room
        io.to(gameRoom.toString()).emit(
          "gameStarted",
          "What is the capital of France?",
        );
      } else {
        console.error("Socket is not in any game room");
      }
    });

    // Join Game
    socket.on("joinGame", (data: { code: number; player: Player }) => {
      const { code, player } = data;
      console.log("code", code);
      console.log("player", player);
      console.log("join game, code: ", code, " id: ", player.id);
      // check if game exists
  if (code in games) {
    // check if name is already taken
    const isNameTaken = games[code].players.some(p => p.name.toLowerCase() === player.name.toLowerCase());
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

    // request game update
    socket.on("requestGameUpdate", (code: number) => {
      // console.log('game update requested', games);

      if (code in games) {
        // emit game update to client
        // console.log('game update: ', games[code])
        socket.emit("gameUpdate", games[code]);
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
      io.to(gameRoom.toString()).emit(
        "recieveQuestion",
        question,
        timePerQuestion,
      );
      setTimeout(() => {
        io.to(gameRoom.toString()).emit("timeOver");
      }, timePerQuestion * 1000);
    });


    // submit answer
    socket.on("submitAnswer", (data: { answer: string }) => {
      console.log("submit answer: ", data.answer);
      const playerId = socket.id;
      const answer = { text: data.answer, submittedBy: playerId, votes: [] };
      console.log(answer)
      const gameRoom: number = getRoom(socket);
      const game = games[gameRoom];
      // store the answer
      game.latestAnswers[playerId] = answer;

      // check if all players have answered
      console.log(game.latestAnswers)
      console.log("game.players: ", game.players)
      const allPlayersAnswered = game.players.every((player) => {
        const playerAnswered = player.id in game.latestAnswers;
        console.log(`Player ${player.id} answered: `, playerAnswered);
        return playerAnswered;
      });
      // const allPlayersAnswered = game.players.every(
      //   (player) => player.id in game.latestAnswers,
      // );
      // if all players have answered, move to next stage
      console.log("all players answered: ", allPlayersAnswered);
      if (allPlayersAnswered) {
        // Create an array of all answers
        const allAnswers = Object.values(game.latestAnswers);

        // Randomize the order of answers
        const randomizedAnswers = allAnswers.sort(() => Math.random() - 0.5);

        // Send personalized answer sets to each player
        game.players.forEach((player) => {
          const playerAnswers = randomizedAnswers.filter(
            (a) => a.submittedBy !== player.id,
          );
          io.to(player.id).emit(
            "allPlayersAnswered",
            playerAnswers,
            game.gameSettings.timePerQuestion,
          );
        });

        // Start the timer for all players
        setTimeout(() => {
          io.to(gameRoom.toString()).emit("timeOver");
        }, game.gameSettings.timePerQuestion * 1000);
      }
    });

    // vote for answer
    socket.on("submitVote", (data: { answerAuthor: ID }) => {
      const voterId = socket.id;
      const { answerAuthor } = data; // vote
      const gameRoom: number = getRoom(socket);
      const game = games[gameRoom];

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
      const allPlayersVoted = totalVotes === game.players.length;
      console.log("all players voted: ", allPlayersVoted, totalVotes, game.players.length);
      io.to(gameRoom.toString()).emit("voteReceived", voterId);

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

        // emit updated scores and latestAnswers to all players
        io.to(gameRoom.toString()).emit(
          "allPlayersVoted",
          game.players,
          game.latestAnswers,
        );
      }
    });



    socket.on("disconnect", () => {
      console.log("user disconnected");
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
