import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1F3A",
          blue: "#117ACA",
          "blue-dark": "#0C5D9A",
          "blue-light": "#E8F1FB",
          white: "#FFFFFF",
          gray: "#F5F7FA",
          "gray-line": "#DDE3EC",
          success: "#1B9E6C",
          danger: "#D64545",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;