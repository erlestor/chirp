import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#050505",
        dim: "#9ca3af",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config
