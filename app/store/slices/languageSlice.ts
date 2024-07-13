// in languageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Language = 'english' | 'spanish' | 'hindi';

type LanguageState = {
  language: Language;
};

const initialState: LanguageState = {
  language: 'english',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;