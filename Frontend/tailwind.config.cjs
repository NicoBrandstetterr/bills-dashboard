module.exports = {
  // Incluir archivos TypeScript/TSX para que Tailwind detecte clases en React + TS
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
};