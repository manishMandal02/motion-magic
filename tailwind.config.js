/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2dd4bf',
          secondary: '#22d3ee',
          darkPrimary: '#0f172a',
          darkSecondary: '#334155',
        },
      },
      height:{
        "1/10": '7%',
        "9/10": '93%',
      }
    },
  },
  plugins: [],
};
