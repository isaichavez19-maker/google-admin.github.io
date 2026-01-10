/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-umbra': '#140028',
        'emerald-umbra': '#00524B',
        'teal-umbra': '#008080',
        'registro-fondo': '#0E021A',
        'registro-borde': '#4A005B',
        'registro-texto': '#E0E0E0',
        'registro-highlight': '#00FFFF',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}
