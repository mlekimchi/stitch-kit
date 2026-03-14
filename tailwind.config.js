/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  'var(--color-cream-50)',
          100: 'var(--color-cream-100)',
          200: 'var(--color-cream-200)',
          300: 'var(--color-cream-300)',
        },
        rose: {
          dusty: 'var(--color-rose-dusty)',
          light: 'var(--color-rose-light)',
          dark:  'var(--color-rose-dark)',
          pale:  'var(--color-rose-pale)',
        },
        sage: {
          DEFAULT: 'var(--color-sage)',
          light:   'var(--color-sage-light)',
          dark:    'var(--color-sage-dark)',
          pale:    'var(--color-sage-pale)',
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
