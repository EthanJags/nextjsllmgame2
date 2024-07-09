import { CREATE_SOCKET } from "../constants/actionNames";
import { CreateSocketAction } from "../constants/actionTypes";

const socket = (state = { socket: null }, action: CreateSocketAction) => {
  switch (action.type) {
    case CREATE_SOCKET:
      console.log("socket reducer");
      return { ...state, socket: action.payload };
    default:
      return state;
  }
};

export default socket;
