import React, { useEffect, useState } from "react";
import { toggleTheme } from "../store/slices/themeSlice";
import { useAppDispatch, useAppSelector } from "../store/constants/reduxTypes";

const DarkModeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const theme = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();


  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className="p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-200"
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? (
        <svg
          className="w-6 h-6 text-yellow-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
