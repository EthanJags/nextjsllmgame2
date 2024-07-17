// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

// const getInitialTheme = () => {
//   const storedTheme = localStorage.getItem('theme');
//   if (storedTheme) {
//     return storedTheme;
//   }
//   return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
// };

const themeSlice = createSlice({
  name: 'theme',
  initialState: 'light',
  reducers: {
    toggleTheme: (state) => {
    //   const newTheme = state === 'light' ? 'dark' : 'light';
    const newTheme = 'light';
      return newTheme;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;