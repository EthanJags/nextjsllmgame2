// // src/store/socketSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { io, Socket } from 'socket.io-client';
// import type { Draft } from 'immer';

// // Define the initial state using a type
// interface SocketState {
//   socket: Socket | null;
//   connected: boolean;
// }

// const initialState: SocketState = {
//   socket: null,
//   connected: false,
// };

// const socketSlice = createSlice({
//   name: 'socket', // Name of the slice
//   initialState,   // Initial state
//   reducers: {     // Reducers
//     connectSocket(state: Draft<SocketState>) {
//       state.socket = io('http://localhost:3000'); // Adjust URL as needed
//       state.connected = true;
//     },
//     disconnectSocket(state: Draft<SocketState>) {
//       state.socket?.disconnect();
//       state.socket = null;
//       state.connected = false;
//     },
//     setSocket(state: Draft<SocketState>, action: PayloadAction<Socket | null>) {
//       state.socket = action.payload;
//       state.connected = !!action.payload;
//     },
//   },
// });

// export const { connectSocket, disconnectSocket, setSocket } = socketSlice.actions;
// export default socketSlice.reducer;