const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config}*/
const config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],

  plugins: [
    require('flowbite/plugin')
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