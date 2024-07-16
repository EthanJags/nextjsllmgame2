import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgba(var(--color-primary-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-primary), <alpha-value>)',
          dark: 'rgba(var(--color-primary-dark), <alpha-value>)',
        },
        secondary: {
          light: 'rgba(var(--color-secondary-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-secondary), <alpha-value>)',
          dark: 'rgba(var(--color-secondary-dark), <alpha-value>)',
        },
        background: {
          light: 'rgba(var(--color-background-light), <alpha-value>)',
          DEFAULT: 'rgba(var(--color-background), <alpha-value>)',
          dark: 'rgba(var(--color-background-dark), <alpha-value>)',
        },
        text: {
          primary: 'rgba(var(--color-text-primary), <alpha-value>)',
          placeholder: 'rgba(var(--color-text-placeholder), <alpha-value>)',
        },
        foreground: 'rgba(var(--color-foreground), <alpha-value>)',
        'background-start': 'rgba(var(--color-background-start), <alpha-value>)',
        'background-end': 'rgba(var(--color-background-end), <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;