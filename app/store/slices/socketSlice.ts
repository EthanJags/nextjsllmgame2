// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  isConnected: boolean;
  id: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  id: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setSocketId: (state, action: PayloadAction<string | null>) => {
      state.id = action.payload;
    },
    disconnectSocket: (state) => {
      state.isConnected = false;
      state.id = null;
    }
  },
});

export const { setConnected, setSocketId } = socketSlice.actions;
export default socketSlice.reducer;