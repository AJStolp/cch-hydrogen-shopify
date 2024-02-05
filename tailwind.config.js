import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    extend: {
      colors: {
        text: '#3d2205',
        background: '#f5f5f5',
        primary: '#f2ebd4',
        secondary: '#dfd7bf',
        accent: '#3d2205',
        sAccent: '#065001',
        sText: '#dfd7bf',
        sSecondary: '#f2f1ee',
      },
    },
  },
};
