import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#4338ca",
          light: "#6366f1",
          lighter: "#818cf8",
          dark: "#a5b4fc",
        },
      },
    },
  },
  plugins: [],
};

export default config;
