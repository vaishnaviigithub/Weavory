/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#D12E2E', // Deep red
            light: '#FF5C5C',
            dark: '#9E1C1C',
          },
          secondary: {
            DEFAULT: '#F5A623', // Gold
            light: '#FFCB77',
            dark: '#D68A00',
          },
          accent: {
            DEFAULT: '#2E4375', // Rich blue
            light: '#5578CF',
            dark: '#1A2A4A',
          },
          
        },
        fontFamily: {
          'heading': ['Playfair Display', 'serif'],
          'body': ['Poppins', 'sans-serif'],
        },
        
      },
    },
    plugins: [],
  }