/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },

    },
  },
  plugins: [
      require('@tailwindcss/forms'),
       require('@tailwindcss/typography'),
       require('@tailwindcss/line-clamp'),
       require('@tailwindcss/aspect-ratio'),
       require('tailwind-scrollbar'),
       require('tailwind-scrollbar-hide'),
  ],
}

