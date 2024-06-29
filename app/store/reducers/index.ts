// purpose of this file is to combine all reducers into one object, and export that object. This is a common pattern in Redux applications, and is a good practice to follow.
import { combineReducers } from "redux";
import language from "./language";

export default combineReducers({
  language,
});
