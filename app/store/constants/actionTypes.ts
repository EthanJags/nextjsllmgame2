import { CHANGE_LANGUAGE } from "./actionNames";
import { SET_PLAYER } from "./actionNames";
import { CREATE_SOCKET } from "./actionNames";
import { Socket } from "socket.io-client";
import { CREATE_ROOM } from "./actionNames";
import { UPDATE_PLAYERS } from "./actionNames";
export interface ChangeLanguageAction {
  type: typeof CHANGE_LANGUAGE;
  payload: boolean;
}

export interface SetPlayerAction {
  type: typeof SET_PLAYER;
  payload: Partial<Player>;
}

export interface CreateSocketAction {
  type: typeof CREATE_SOCKET;
  payload: Socket;
}

interface CreateRoomAction {
  type: typeof CREATE_ROOM;
  payload: Game;
}

interface UpdatePlayerRoomAction {
  type: typeof UPDATE_PLAYERS;
  payload: Player[];
}

export type RoomActionTypes = CreateRoomAction | UpdatePlayerRoomAction;
