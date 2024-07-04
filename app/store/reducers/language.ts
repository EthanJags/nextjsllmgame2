import { CHANGE_LANGUAGE } from "../constants/actionNames";
import { ChangeLanguageAction } from "../constants/actionTypes";

const languageReducer = (
  state = { isEnglish: false },
  action: ChangeLanguageAction,
) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return { ...state, isEnglish: action.payload };
    default:
      return state;
  }
};

export default languageReducer;
