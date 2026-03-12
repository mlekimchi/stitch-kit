/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFAF5',
          100: '#FBF6EC',
          200: '#F5ECD8',
          300: '#EDD9BF',
        },
        rose: {
          dusty: '#C47A7F',
          light: '#D9A5A9',
          dark:  '#A45E63',
          pale:  '#F2DEDE',
        },
        sage: {
          DEFAULT: '#8FAF90',
          light:   '#B5CDB6',
          dark:    '#6A8F6B',
          pale:    '#DCE9DC',
        },
        yarn: {
          warm:  '#E8C5A0',
          brown: '#8B6040',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Palatino', 'serif'],
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft:  '0 2px 12px rgba(0,0,0,0.08)',
        card:  '0 4px 20px rgba(0,0,0,0.08)',
        inner: 'inset 0 2px 6px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
