import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import e from 'express';


const initialState: Partial<Game> = {
    code: undefined,
    players: undefined,
    highScore: 0,
    highScorePlayer: null,
    gameSettings: {
      rounds: 5,
      timePerQuestion: 30,
    },
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
        },
    setGameCode: (state, action: PayloadAction<number>) => {
        state.code = action.payload
        },
    setGameSettings: (state, action: PayloadAction<GameSettings>) => {
        state.gameSettings = action.payload;
        },
    updateHighScore: (state, action: PayloadAction<number>) => {
        state.highScore = action.payload;
        },
    updateHighScorePlayer: (state, action: PayloadAction<string>) => {
        state.highScorePlayer = action.payload;
        },
    addPlayer: (state, action: PayloadAction<Player>) => {
        if (!state.players) {
          state.players = [action.payload];
        } else {
        state.players.push(action.payload);
        }
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
    updateHighScore,
    updateHighScorePlayer,
    addPlayer,
} = gameSlice.actions;

export default gameSlice.reducer;