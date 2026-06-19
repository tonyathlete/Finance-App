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
        // "Control Room" palette — a periwinkle/indigo AI-dashboard look:
        // light glass surfaces, glossy indigo actions, gradient stat tiles.
        encre: {
          DEFAULT: '#1E1B4B', // indigo-950 — headings, primary text
          light: '#4338CA',
        },
        papier: {
          DEFAULT: '#F3F4FC', // periwinkle-tinted page background
          card: '#FFFFFF', // glass card surface
        },
        manille: {
          DEFAULT: '#60A5FA', // sky accent — secondary highlight / "this week"
          dark: '#2563EB',
        },
        sceau: {
          DEFAULT: '#EF4444', // alert red — overdue / urgent
          light: '#FEE2E2',
        },
        sauge: {
          DEFAULT: '#10B981', // affirmative green — done / on track
          light: '#D1FAE5',
        },
        // legacy aliases so existing brand-*/accent-*/ia-* utility classes
        // resolve to the new palette without a file-by-file rename
        ia: {
          blue: '#5B5FEF',
          lightblue: '#EEF0FF',
          dark: '#1E1B4B',
        },
        brand: {
          50: '#EEF0FF',
          100: '#E0E3FB',
          500: '#5B5FEF',
          600: '#4C51E0',
          700: '#3730A3',
          900: '#1E1B4B',
        },
        accent: {
          500: '#A855F7',
          600: '#9333EA',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #6366F1 0%, #4C51E0 100%)',
        'gradient-soft': 'linear-gradient(180deg, #F3F4FC 0%, #EEF0FF 100%)',
        'gradient-card': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFF 100%)',
        'gradient-glossy': 'linear-gradient(180deg, #93C5FD 0%, #5B5FEF 100%)',
        'gradient-blue': 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
        'gradient-magenta': 'linear-gradient(135deg, #D946EF 0%, #A21CAF 100%)',
        'gradient-red': 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
        'gradient-green': 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
      },
      boxShadow: {
        'glow': '0 8px 24px -8px rgba(91,95,239,0.35)',
        'card': '0 1px 2px rgba(30,27,75,0.06), 0 8px 24px -12px rgba(30,27,75,0.08)',
        'stamp': '0 8px 20px -6px rgba(91,95,239,0.4)',
        'stamp-sm': '0 4px 12px -4px rgba(91,95,239,0.35)',
        'glass': 'inset 0 1px 0 0 rgba(255,255,255,0.6), 0 8px 30px -10px rgba(30,27,75,0.12)',
      },
      borderRadius: {
        DEFAULT: '0.875rem',
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
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
