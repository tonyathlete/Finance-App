/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ia: {
          blue: '#003DA5',
          lightblue: '#E8EEF8',
          dark: '#1A1A2E',
        },
      },
    },
  },
  plugins: [],
}
