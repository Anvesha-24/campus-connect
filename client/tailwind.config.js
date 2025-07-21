module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",          // ✅ this already covers /pages and /components
    "./components/**/*.{js,jsx,ts,tsx}",   // optional if you move components outside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
