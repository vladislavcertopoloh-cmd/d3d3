import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#101419",
        panel: "#161b22",
        accent: "#58c4dd",
        positive: "#38d996",
        negative: "#ff6b6b",
        warning: "#f6c85f"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};

export default config;
