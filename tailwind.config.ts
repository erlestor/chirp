import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#050505",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config
