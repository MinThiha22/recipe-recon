/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#405D72",
        title: "#FFA726",
        secondary: "#F7E7DC"
      },
      fontFamily: {
        chewy: ["Chewy-Regular","sans-serif"],
        poppinsBlack: ["Poppins-Black","sans-serif"],
        poppinsBold: ["Poppins-Bold", "sans-serif"],
        poppinsExtraBold: ["Poppins-ExtraBold", "sans-serif"],
        poppingsExtraLight: ["Poppins-ExtraLight", "sans-serif"],
        poppingsItalic: ["Poppins-Italic", "sans-serif"],
        poppingsLight: ["Poppins-Light", "sans-serif"],
        poppingsRegular: ["Poppins-Regular", "sans-serif"],
        poppingsSemiBold: ["Poppins-SemiBold", "sans-serif"],
        poppingsThin: ["Poppins-Thin", "sans-serif"]
      }
    },
  },
  plugins: [],
}

