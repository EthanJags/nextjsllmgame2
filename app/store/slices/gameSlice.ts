import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import e from 'express';

const player: Player = {
    id: '',
    name: null,
    score: 0,
    isHost: false,
  };

const initialState: Game = {
    code: -1,
    players: [player],
    highScore: 0,
    highScorePlayer: null,
    gameSettings: {
      rounds: 5,
      timePerQuestion: 30,
    },
    answers: {},
    gameActive: false,
    currentStage: 'Answering',
    currentQuestion: 'question',
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<Game>) => {
        state.code = action.payload.code;
        state.players = action.payload.players;
        state.highScore = action.payload.highScore;
        state.highScorePlayer = action.payload.highScorePlayer;
        state.gameSettings = action.payload.gameSettings;
        state.answers = action.payload.answers;
        state.gameActive = action.payload.gameActive;
        state.currentStage = action.payload.currentStage;
        state.currentQuestion = action.payload.currentQuestion;
        },
    setGameCode: (state, action: PayloadAction<number>) => {
        state.code = action.payload
        },
    setGameSettings: (state, action: PayloadAction<GameSettings>) => {
        state.gameSettings = action.payload;
        },
    setAnswers: (state, action: PayloadAction<{ [playerId: string]: string }>) => {
        state.answers = action.payload;
        },
    updateHighScore: (state, action: PayloadAction<number>) => {
        state.highScore = action.payload;
        },
    updateHighScorePlayer: (state, action: PayloadAction<string>) => {
        state.highScorePlayer = action.payload;
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
        state.code = -1;
        state.players = [player];
        state.highScore = 0;
        state.highScorePlayer = null;
        state.gameSettings = {
          rounds: 5,
          timePerQuestion: 30,
        };
        state.answers = {};
        state.gameActive = false;
        state.currentStage = 'Answering';
        state.currentQuestion = 'question';
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
    updateHighScore,
    updateHighScorePlayer,
    addPlayer,
    setGameActive,
    setCurrentStage,
    setCurrentQuestion,
    resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;