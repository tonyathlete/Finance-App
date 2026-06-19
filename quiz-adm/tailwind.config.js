/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        ledger: ['var(--font-ledger)', 'monospace'],
      },
      colors: {
        // "Dossier" palette — a financial meeting rendered as paper, ink and a wax seal.
        encre: {
          DEFAULT: '#1C2B3A', // ink navy — display type, primary surfaces
          light: '#324456',
        },
        papier: {
          DEFAULT: '#EEECE1', // ledger paper — page background
          card: '#F7F5EC', // dossier card surface, slightly lighter than the page
        },
        manille: {
          DEFAULT: '#D8CDA9', // kraft folder tab
          dark: '#B7A877',
        },
        sceau: {
          DEFAULT: '#8C3324', // stamp red — the one accent, used sparingly
          light: '#FBEAE5',
        },
        sauge: {
          DEFAULT: '#46604E', // ledger green — affirmative / "ok" states
          light: '#E6ECE3',
        },
        // legacy aliases so existing brand-*/accent-*/ia-* utility classes
        // resolve to the new palette without a file-by-file rename
        ia: {
          blue: '#1C2B3A',
          lightblue: '#EBEEF1',
          dark: '#1C2B3A',
        },
        brand: {
          50: '#EBEEF1',
          100: '#D8CDA9',
          500: '#1C2B3A',
          600: '#19242F',
          700: '#142029',
          900: '#0F171F',
        },
        accent: {
          500: '#8C3324',
          600: '#6F2A1D',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(180deg, #1C2B3A 0%, #1C2B3A 100%)',
        'gradient-soft': 'linear-gradient(180deg, #EEECE1 0%, #F7F5EC 100%)',
        'gradient-card': 'linear-gradient(180deg, #F7F5EC 0%, #F7F5EC 100%)',
        'ledger-lines': 'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(28,43,58,0.06) 28px)',
      },
      boxShadow: {
        // a flat, offset "stamped paper" shadow instead of a soft glow
        'glow': '4px 4px 0 0 rgba(28,43,58,0.18)',
        'card': '0 1px 2px rgba(28,43,58,0.1)',
        'stamp': '4px 4px 0 0 rgba(28,43,58,0.16)',
        'stamp-sm': '2px 2px 0 0 rgba(28,43,58,0.14)',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'stamp-in': 'stampIn 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stampIn: {
          '0%': { opacity: '0', transform: 'scale(1.3) rotate(-6deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-2deg)' },
        },
      },
    },
  },
  plugins: [],
}
