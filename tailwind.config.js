/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Microsoft YaHei"],
        body: ["Microsoft YaHei"],
        script: ["Microsoft YaHei"],
      },
    },
  },
  plugins: [],
}
