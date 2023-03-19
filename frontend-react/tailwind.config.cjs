/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#0b3c95",
          "secondary": "#84d2f3",
          "accent": "#fdd231",
          "neutral": "#e5e7eb",
          "base-100": "#1b44a6",
          "info": "#8DCAC1",
          "success": "#d9f99d",
          "warning": "#fe4135",
          // "warning": "#fdd231",
          "error": "#dc2626",
        },
      },
    ],
  },
  theme: {
    extend: {
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        14: '14',
        20: '20'
      }
    },
    screens: {
      sm: '675px',
      md: '768px',
      lg: '1003px',
      xl: '1310px',
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/line-clamp')
  ],
}
