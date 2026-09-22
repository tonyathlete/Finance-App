/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        forest: {
          50: '#eef4f0',
          100: '#d6e6dc',
          200: '#adccb9',
          300: '#7fae91',
          400: '#548b6c',
          500: '#386b4f',
          600: '#2e5d45',
          700: '#254a37',
          800: '#1b3a2b',
          900: '#14281d',
          950: '#0c1912',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f5ebcd',
          200: '#ebd79b',
          300: '#e0c26a',
          400: '#d4af37',
          500: '#c8a24b',
          600: '#a9832f',
          700: '#856527',
          800: '#634b22',
          900: '#463619',
        },
        paper: {
          50: '#faf9f5',
          100: '#f5f3ec',
          200: '#ece8dc',
          300: '#ddd7c4',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,40,29,0.04), 0 8px 24px rgba(20,40,29,0.06)',
        lift: '0 12px 32px rgba(20,40,29,0.12)',
      },
    },
  },
  plugins: [],
};
