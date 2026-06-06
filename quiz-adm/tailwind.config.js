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
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          500: '#3b6cff',
          600: '#2754e6',
          700: '#1d3fb3',
          900: '#0a1f5c',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0a1f5c 0%, #2754e6 50%, #3b6cff 100%)',
        'gradient-soft': 'linear-gradient(135deg, #eef4ff 0%, #ffffff 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(59, 108, 255, 0.3)',
        'card': '0 4px 24px -8px rgba(10, 31, 92, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
