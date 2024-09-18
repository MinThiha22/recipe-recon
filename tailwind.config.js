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
        poppinsExtraLight: ["Poppins-ExtraLight", "sans-serif"],
        poppinsItalic: ["Poppins-Italic", "sans-serif"],
        poppinsLight: ["Poppins-Light", "sans-serif"],
        poppinsRegular: ["Poppins-Regular", "sans-serif"],
        poppinsSemiBold: ["Poppins-SemiBold", "sans-serif"],
        poppingsThin: ["Poppins-Thin", "sans-serif"]
      }
    },
  },
  plugins: [],
}

