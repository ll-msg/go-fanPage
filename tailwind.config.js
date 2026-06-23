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
        cute: ["Caveat", "cursive"],
        // cinematic black & white display type (Latin) for credits / titles
        cine: ["Oswald", "Microsoft YaHei", "sans-serif"],
        // clean, legible sans for body / titles (good Latin + native CJK)
        readable: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
      boxShadow: {
        cine: "0 14px 30px -12px rgba(0,0,0,0.45)",
        "cine-hover": "0 22px 44px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
}
