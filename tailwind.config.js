/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d3748',
        },
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'ethereal-float': 'ethereal-float 15s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-15px)' },
          '75%': { transform: 'translateY(-15px) translateX(5px)' },
        },
        'ethereal-float': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-20px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(20px, -10px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 10px) scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};
