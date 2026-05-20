/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        db: {
          black: "#080808",
          panel: "#111111",
          panel2: "#1a1a1a",
          orange: "#ff6b1a",
          gold: "#ffd700",
          blue: "#0066cc",
          muted: "#a0a0a0",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 107, 26, 0.22)",
        card: "0 20px 50px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};
