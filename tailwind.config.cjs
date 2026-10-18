// FILE: tailwind.config.cjs
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  corePlugins: {
    // Post HTML uses its own `.container` wrapper; Tailwind's version would fight it.
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Deep "Moldova blue" brand scale
        brand: {
          50: '#eef4ff',
          100: '#dae6ff',
          200: '#bdd3ff',
          300: '#90b6ff',
          400: '#5c8dfd',
          500: '#3766f9',
          600: '#1f47ee',
          700: '#1736db',
          800: '#192fb1',
          900: '#1a2e8b',
          950: '#151e54',
        },
        // Flag yellow accent
        sun: {
          300: '#ffe27a',
          400: '#ffd200',
          500: '#f2b705',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)',
        lift: '0 2px 4px rgb(15 23 42 / 0.04), 0 18px 40px -16px rgb(15 23 42 / 0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'scale-in': 'scale-in 0.18s ease-out both',
      },
    },
  },
  plugins: [],
}
