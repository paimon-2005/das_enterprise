/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#2E7D32', // Primary brand green
          700: '#256427',
          800: '#1B5E20', // Dark primary (navbar/header)
          900: '#14451a',
        },
        accent: {
          400: '#ffa726',
          500: '#FB8C00', // CTA orange
          600: '#f57c00',
        },
        surface: '#F4F6F8',   // page background
        card:    '#FFFFFF',   // card background
        txt: {
          primary:   '#212121',
          secondary: '#757575',
        }
      },
      fontFamily: {
        inter:   ['Inter', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        card2: '0 4px 12px 0 rgb(0 0 0 / 0.08)',
      },
    },
  },
  plugins: [],
}
