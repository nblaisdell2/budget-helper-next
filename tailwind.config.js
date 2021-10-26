module.exports = {
  purge: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      fontWeight: ["hover", "focus"],
      borderRadius: ["hover", "focus"],
    },
  },
  plugins: [],
};
