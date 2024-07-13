import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import e from "express";

const player: Player = {
  id: "",
  name: "",
  score: 0,
  isHost: false,
};

const initialState: Game = {
  code: -1,
  players: [player],
  gameSettings: {
    rounds: 5,
    timePerQuestion: 30,
  },
  latestAnswers: {},
  gameActive: false,
  currentStage: "Answering",
  currentRound: 1,
  currentQuestion: "question",
  chatHistory: [],
};

const resetState: Game = {
  // this is needed cuz persistence overrides the namespace initialState
  code: -1,
  players: [player],
  gameSettings: {
    rounds: 5,
    timePerQuestion: 30,
  },
  latestAnswers: {},
  gameActive: false,
  currentStage: "Answering",
  currentRound: 1,
  currentQuestion: "question",
  chatHistory: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
      state.code = action.payload.code;
      state.players = action.payload.players;
      state.gameSettings = action.payload.gameSettings;
      state.latestAnswers = action.payload.latestAnswers;
      state.gameActive = action.payload.gameActive;
      state.currentStage = action.payload.currentStage;
      state.currentQuestion = action.payload.currentQuestion;
      state.currentRound = action.payload.currentRound;
    },
    setGameCode: (state, action: PayloadAction<number>) => {
      state.code = action.payload;
    },
    setGameSettings: (state, action: PayloadAction<GameSettings>) => {
      state.gameSettings = action.payload;
    },
    setAnswers: (state, action: PayloadAction<LatestAnswers>) => {
      state.latestAnswers = action.payload;
    },
    setGameActive: (state, action: PayloadAction<boolean>) => {
      state.gameActive = action.payload;
    },
    setCurrentStage: (state, action: PayloadAction<GameStates>) => {
      state.currentStage = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<string>) => {
      state.currentQuestion = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      if (!state.players) {
        state.players = [action.payload];
      } else {
        state.players.push(action.payload);
      }
    },
    resetGame: (state) => {
      state = resetState;
    },
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    incrementRound: (state) => {
      state.currentRound++;
    },

    //     removePlayer: (state, action: PayloadAction<ID>) => {
    //         if (state.Players) {
    //             state.Players = state.Players.filter((player) => player.id !== action.payload);
    //         } else {
    //             console.error('Player not found');
    //         }
  },
});

export const {
  setGameCode,
  setGame,
  setGameSettings,
  setAnswers,
  addPlayer,
  setGameActive,
  setCurrentStage,
  setCurrentQuestion,
  resetGame,
  setPlayers,
  incrementRound,
} = gameSlice.actions;

export default gameSlice.reducer;
