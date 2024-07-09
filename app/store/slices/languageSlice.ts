import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
  isEnglish: boolean;
}

const initialState: LanguageState = {
  isEnglish: true, // Default to English
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state) => {
      state.isEnglish = !state.isEnglish;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
