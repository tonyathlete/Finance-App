/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Serif calligraphiée élégante (marque Anthony Goulet)
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        // Vert forêt profond (échantillonné du site de marque)
        forest: {
          50: '#eef3ef',
          100: '#d5e4da',
          200: '#acc8b6',
          300: '#7da88c',
          400: '#518768',
          500: '#366a4c',
          600: '#2b5a40',
          700: '#224733',
          800: '#1b3728',
          900: '#162219',
          950: '#101d13',
        },
        // Or antique (échantillonné : #c4a052)
        gold: {
          50: '#f8f2e3',
          100: '#efe1c1',
          200: '#e2cd94',
          300: '#d4ba72',
          400: '#c4a052',
          500: '#b28f45',
          600: '#95753a',
          700: '#715a2d',
          800: '#524123',
          900: '#3a2f1b',
        },
        // Neutres chauds / papier (sections claires)
        paper: {
          50: '#f3f1ea',
          100: '#ece9e0',
          200: '#e0ddd1',
          300: '#cfcabb',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,29,19,0.05), 0 8px 24px rgba(16,29,19,0.07)',
        lift: '0 14px 36px rgba(16,29,19,0.14)',
      },
    },
  },
  plugins: [],
};
