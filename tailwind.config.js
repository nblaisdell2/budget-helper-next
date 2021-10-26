module.exports = {
  purge: [
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
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
