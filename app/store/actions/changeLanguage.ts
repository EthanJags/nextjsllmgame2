import { CHANGE_LANGUAGE } from "../constants/actionTypes";
import { AppDispatch } from "../store";

export const changeLanguage =
  (data: boolean) => async (dispatch: AppDispatch) => {
    try {
      const action: ChangeLanguageAction = {
        type: CHANGE_LANGUAGE,
        payload: data,
      };
      dispatch(action);
    } catch (error) {
      console.log(error);
    }
  };
