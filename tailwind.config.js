/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Crimson Text', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50:  '#f5f5f5',
          100: '#e0e0e0',
          200: '#c2c2c2',
          300: '#000000',
          400: '#000000',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        surface: {
          50:  '#FFFFFF',
          100: '#FAFAFA',
          200: '#F4F1EE',
          300: '#E8E5E1',
          400: '#000000',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        accent: {
          DEFAULT: '#000000',
          hover: '#333333',
        },
      },
      letterSpacing: {
        'widest-xl': '0.15em',
      },
    },
  },
  plugins: [],
}
