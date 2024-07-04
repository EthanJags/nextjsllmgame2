import { Socket } from "socket.io-client";
import { CREATE_SOCKET, SET_PLAYER } from "../constants/actionNames";
import { AppDispatch } from "../store";

export const createSocket =
  (data: Socket ) => async (dispatch: AppDispatch) => {
    try {
      const action = {
        type: CREATE_SOCKET,
        payload: data,
      };
      console.log('socket action')
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
