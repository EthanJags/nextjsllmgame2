import { CREATE_ROOM } from "../constants/actionNames";
import { AppDispatch } from "../store";

export const createRoom =
  (data: Partial<Game>) => async (dispatch: AppDispatch) => {
    try {
      const action = {
        type: CREATE_ROOM,
        payload: data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
