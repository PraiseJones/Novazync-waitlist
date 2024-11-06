/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        bgBlack: "#10100e",
        twhite: "#FFFFE3",
        grayd3color: "#191815",
        grayd2color: "#30302b",
        grayd1color: "#606055",
        graybcolor: "#c0c0ab",
        grayl1color: "#e8e8cf",
        grayl2color: "#f8f8dd",
        themebcolor: "#FFFFE3",
      },
      gridTemplateColumns: {
        "auto-repeat-2": "auto repeat(2, min-content)",
        "auto-repeat-1": "auto repeat(1, min-content)",
        "fr-fr": "1fr, 2fr",
        "repeat-1": "repeat(1, 1fr)",
      },
      gridColumn: {
        "column-1": "1 / -1",
      },
    },
  },
  plugins: [],
};