/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.{html,js,ejs}', './views/**/*.{html,js,ejs}'],
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      screens: {
        xs: '320px',
      },
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
  },
};
