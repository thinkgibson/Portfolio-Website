/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        win95: {
          teal: "#008080",
          gray: "#C0C0C0",
          taskbar: "#BDBDBD",
          'blue-active': "#000080",
          'gray-inactive': "#808080",
          light: "#FFFFFF",
          dark: "#000000",
        },
      },
      fontFamily: {
        win95: ["'W95FA'", "'Microsoft Sans Serif'", "Tahoma", "Geneva", "Verdana", "sans-serif"],
        'win95-mono': ["'Courier New'", "monospace"],
        sans: ["'W95FA'", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      boxShadow: {
        'win95-outset': 'inset 1px 1px #fff, inset -1px -1px #0a0a0a, inset 2px 2px #dfdfdf, inset -2px -2px #808080',
        'win95-inset': 'inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
        'win95-button': 'inset 1px 1px #fff, inset -1px -1px #0a0a0a, inset 2px 2px #dfdfdf, inset -2px -2px #808080',
        'win95-button-active': 'inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
      },
      borderRadius: {
        'none': '0px',
      }
    },
  },
  plugins: [],
}
