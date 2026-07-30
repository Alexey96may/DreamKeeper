/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          50: '#fdf8f0',
          100: '#fbf0d9',
          200: '#f5dba8',
          300: '#f0c677',
          400: '#eab146',
          500: '#e59c15', // основной золотой
          600: '#b77d11',
          700: '#895e0d',
          800: '#5c3f08',
          900: '#2e1f04',
        },
        night: {
          50: '#f0f0f5',
          100: '#d9d9e6',
          200: '#b3b3cc',
          300: '#8c8cb3',
          400: '#666699',
          500: '#404080', // основной ночной
          600: '#333366',
          700: '#26264d',
          800: '#1a1a33',
          900: '#0d0d1a',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}