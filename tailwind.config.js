/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s infinite linear',
        'glow-pulse': 'glowPulse 2s infinite ease-in-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-15deg)' },
          '50%': { transform: 'translateX(150%) skewX(-15deg)' },
          '100%': { transform: 'translateX(150%) skewX(-15deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { opacity: 1, transform: 'scale(1.03)', filter: 'brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.3))' },
        }
      }
    },
  },
  plugins: [],
}
