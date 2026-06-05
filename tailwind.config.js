/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202a',
        field: '#f3f8f6',
        court: '#0d6b5f',
        flame: '#e34f2f',
        lime: '#c7ef4e',
        ocean: '#2676d6',
      },
      boxShadow: {
        lift: '0 18px 45px rgba(23, 32, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
