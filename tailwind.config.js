/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.{html,js,ejs}', './views/*.{html,js,ejs}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
  theme: {
    // screens: {
    //   sm: '480px',
    //   md: '768px',
    //   lg: '976px',
    //   xl: '1440px',
    // },
    // colors: {
    //   blue: '#1fb6ff',
    //   pink: '#ff49db',
    //   orange: '#ff7849',
    //   green: '#13ce66',
    //   'gray-dark': '#273444',
    //   gray: '#8492a6',
    //   'gray-light': '#d3dce6',
    // },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      //   serif: ['Merriweather', 'serif'],
    },
    // extend: {
    //   spacing: {
    //     128: '32rem',
    //     144: '36rem',
    //   },
    //   borderRadius: {
    //     '4xl': '2rem',
    //   },
    // },
  },
};
