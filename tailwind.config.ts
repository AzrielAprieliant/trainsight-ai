import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060b18',
          900: '#0a1128',
          800: '#101d3a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
