// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import playerReducer from "./slices/playerSlice";
import gameReducer from "./slices/gameSlice";
import languageReducer from "./slices/languageSlice";
import { createLogger } from 'redux-logger';
import socketReducer from "./slices/socketSlice";

const logger = createLogger({ level: 'log' });

// Persistence configuration
const persistConfig = {
  key: 'root',
  storage,
  // If you want to persist only specific reducers, use a whitelist:
  // whitelist: ['player', 'game', 'language']
};

// Combine all reducers
const rootReducer = combineReducers({
  player: playerReducer,
  game: gameReducer,
  language: languageReducer,
  socket: socketReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(logger),
});

// Create the persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;