/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#c983c0', // Example primary color for light mode
          dark: '#1266f1',  // Example primary color for dark mode
        },
        secondary: {
          light: '#A1C2C8', // Example secondary color for light mode
          dark: '#a83283',  // Example secondary color for dark mode
        },
        tertiary: {
          light: '#f59e0b', // Example tertiary color for light mode
          dark: '#8bba79',  // Example tertiary color for dark mode
        },
        background: {
          light: '#ffffff', // Background color for light mode
          dark: '#1c1c1c',  // Background color for dark mode
        },
        backgroundSCD: {
          light: '#fafafa', // Background color for light mode
          dark: '#1f2930',  // Background color for dark mode
        },
        text: {
          light: '#1f2937', // Text color for light mode
          dark: '#f9fafb',  // Text color for dark mode
        },
        textscd: {
          light: '#252525', // Text color for light mode
          dark: '#e5e5e5',  // Text color for dark mode
        },
        border: {
          light: '#e5e7eb', // Border color for light mode
          dark: '#374151',  // Border color for dark mode
        },
        warning: {
          light: '##c91246', // Border color for light mode
          dark: '##c91246',  // Border color for dark mode
        },
      },
      fontFamily: {
        header: ['IBM Plex Sans', 'sans-serif'], // Custom font for headers
        body: ['Inter', 'sans-serif'],  
        button: ['Poppins', 'sans-serif']        // Custom font for body text
      },
    },
  },
  plugins: [],
}