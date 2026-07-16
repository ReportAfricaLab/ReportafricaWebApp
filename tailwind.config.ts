import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0F7B6C', dark: '#0B6E4F', light: '#146C43' },
        secondary: { DEFAULT: '#F4B400', dark: '#E0A106', light: '#D4A017' },
        emergency: { DEFAULT: '#D92D20', dark: '#C62828' },
        humanitarian: { DEFAULT: '#F97316' },
        info: { DEFAULT: '#2563EB' },
        dark: { bg: '#0F172A', card: '#1E293B' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
