/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0f19',
        gold: {
          DEFAULT: '#ffc83d',
          soft: '#ffe08a',
          deep: '#e0a800'
        }
      }
    }
  },
  plugins: []
};
