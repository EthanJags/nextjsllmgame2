import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Player = {
  id: "",
  name: "",
  score: 0,
  isHost: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setPlayerScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    setPlayerIsHost: (state, action: PayloadAction<boolean>) => {
      state.isHost = action.payload;
    },
    resetPlayer: (state) => {
      state = initialState;
    },
  },
});

export const { setPlayerID, setPlayerName, setPlayerScore, setPlayerIsHost, resetPlayer } = playerSlice.actions;

export default playerSlice.reducer;
