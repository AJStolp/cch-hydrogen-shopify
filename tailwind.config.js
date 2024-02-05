import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    extend: {
      colors: {
        text: '#3F2305',
        background: '#F5F5F5',
        primary: '#f2ebd4',
        secondary: '#DFD7BF',
        accent: '#5d4123',
        sAccent: '#065001',
        sText: '#dfd7bf',
        sSecondary: '#f2f1ee',
      },
    },
  },
};
