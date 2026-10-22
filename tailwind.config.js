/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f0f9f1",
          100: "#dcf1de",
          200: "#bbe3c0",
          300: "#8dcf97",
          400: "#58b566",
          500: "#349a45",
          600: "#257c35",
          700: "#1f622c",
          800: "#1c4e26",
          900: "#184122",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
