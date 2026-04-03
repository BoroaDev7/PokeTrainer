/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        yellow: {
          400: '#FFD83D',
          300: '#FFE76B',
          800: '#7A5F00',
        },
      },
      borderWidth: { 5: '5px' },
    },
  },
  plugins: [],
};
