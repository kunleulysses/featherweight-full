import { defineConfig } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00BFFF',
        offwhite: '#F0F0F0',
      },
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at center, #000000 0%, #000022 100%)',
      },
    },
  },
  plugins: [typography],
})