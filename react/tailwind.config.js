/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [], 
  purge: {
    enabled: true, // Enable purge in production
    content: ['./src/**/**/*.{js,jsx,ts,tsx}'],
  },
}

