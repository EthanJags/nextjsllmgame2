import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          light: "#4F46E5", // indigo-600
          DEFAULT: "#4338CA", // indigo-700
          dark: "#3730A3", // indigo-800
        },
        secondary: {
          light: "#10B981", // emerald-500
          DEFAULT: "#059669", // emerald-600
          dark: "#047857", // emerald-700
        },
        background: {
          light: "#F3F4F6", // gray-100
          DEFAULT: "#E5E7EB", // gray-200
          dark: "#D1D5DB", // gray-300
        },
        text: {
          primary: "#1F2937", // equivalent to gray-800
          placeholder: "#9CA3AF", // equivalent to gray-400
        },
      },
    },
  },
  plugins: [],
};
export default config;
