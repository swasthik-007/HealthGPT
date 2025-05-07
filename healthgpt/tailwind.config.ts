import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👈 enable dark mode with class strategy
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
