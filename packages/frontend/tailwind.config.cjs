const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config}*/
const config = {
  mode: 'jit',
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter Variable', ...defaultTheme.fontFamily.sans],
      },
    }, 
    screens: {
      ...defaultTheme.screens,
      'xl': '1440px', // original 1280px
      '2xl': '1680px', // original 1536px
    }
  }
};

module.exports = config;