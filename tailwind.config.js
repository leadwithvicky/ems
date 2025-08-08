/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coral: '#FF715B',
        yellow: '#FFD447', 
        purple: '#5E60CE',
        pink: '#FF6B9D',
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(255, 113, 91, 0.5)',
      }
    },
  },
  plugins: [],
};