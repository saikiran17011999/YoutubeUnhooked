/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // YouTube-like dark theme colors
        'yt-black': '#0f0f0f',
        'yt-dark': '#181818',
        'yt-darker': '#212121',
        'yt-light': '#282828',
        'yt-lighter': '#3f3f3f',
        'yt-text': '#f1f1f1',
        'yt-text-secondary': '#aaaaaa',
        'yt-red': '#ff0000',
        'yt-blue': '#3ea6ff',
      },
      fontFamily: {
        'roboto': ['Roboto', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}
