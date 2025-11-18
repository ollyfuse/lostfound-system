/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'cardCycle1': 'cardCycle1 12s ease-in-out infinite',
        'cardCycle2': 'cardCycle2 12s ease-in-out infinite',
        'cardCycle3': 'cardCycle3 12s ease-in-out infinite',
        'cardCycle4': 'cardCycle4 12s ease-in-out infinite',
      },
      keyframes: {
        cardCycle1: {
          '0%, 25%': { transform: 'translateX(0) translateY(0) rotate(0deg) scale(1.1)', zIndex: '50' },
          '25%, 50%': { transform: 'translateX(8px) translateY(8px) rotate(-2deg) scale(1)', zIndex: '30' },
          '50%, 75%': { transform: 'translateX(16px) translateY(16px) rotate(3deg) scale(1)', zIndex: '20' },
          '75%, 100%': { transform: 'translateX(24px) translateY(24px) rotate(6deg) scale(1)', zIndex: '10' },
        },
        cardCycle2: {
          '0%, 25%': { transform: 'translateX(24px) translateY(24px) rotate(6deg) scale(1)', zIndex: '10' },
          '25%, 50%': { transform: 'translateX(0) translateY(0) rotate(0deg) scale(1.1)', zIndex: '50' },
          '50%, 75%': { transform: 'translateX(8px) translateY(8px) rotate(-2deg) scale(1)', zIndex: '30' },
          '75%, 100%': { transform: 'translateX(16px) translateY(16px) rotate(3deg) scale(1)', zIndex: '20' },
        },
        cardCycle3: {
          '0%, 25%': { transform: 'translateX(16px) translateY(16px) rotate(3deg) scale(1)', zIndex: '20' },
          '25%, 50%': { transform: 'translateX(24px) translateY(24px) rotate(6deg) scale(1)', zIndex: '10' },
          '50%, 75%': { transform: 'translateX(0) translateY(0) rotate(0deg) scale(1.1)', zIndex: '50' },
          '75%, 100%': { transform: 'translateX(8px) translateY(8px) rotate(-2deg) scale(1)', zIndex: '30' },
        },
        cardCycle4: {
          '0%, 25%': { transform: 'translateX(8px) translateY(8px) rotate(-2deg) scale(1)', zIndex: '30' },
          '25%, 50%': { transform: 'translateX(16px) translateY(16px) rotate(3deg) scale(1)', zIndex: '20' },
          '50%, 75%': { transform: 'translateX(24px) translateY(24px) rotate(6deg) scale(1)', zIndex: '10' },
          '75%, 100%': { transform: 'translateX(0) translateY(0) rotate(0deg) scale(1.1)', zIndex: '50' },
        },
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
      })
    }
  ],
  safelist: [
    'ring-red-400',
    'ring-blue-400',
    'ring-opacity-75',
    'perspective-1000',
    'transform-style-preserve-3d',
    'backface-hidden',
    'rotate-y-180',
    'animate-cardCycle1',
    'animate-cardCycle2',
    'animate-cardCycle3',
    'animate-cardCycle4'
  ]
}
