/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#eddfff',
          200: '#dbc4ff',
          300: '#be9bff',
          400: '#9d68ff',
          500: '#7b2cbf',
          600: '#691fb0',
          700: '#561694',
          800: '#461278',
          900: '#2e0753',
          950: '#0f051d',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
