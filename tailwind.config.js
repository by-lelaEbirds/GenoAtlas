/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // INJETANDO A FONTE OUTFIT
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'bounce-short': 'bounce 1s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-point': 'float-point 0.8s ease-out forwards',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'fade-out-down': 'fade-out-down 0.3s ease-in',
        // NOVAS ANIMAÇÕES VIRAIS
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-point': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(1.5)', opacity: '0' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'fade-out': { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-out-down': { '0%': { opacity: '1', transform: 'translateY(0)' }, '100%': { opacity: '0', transform: 'translateY(20px)' } },
        // KEYFRAMES DO NEON
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5) drop-shadow(0 0 10px rgba(255,255,255,0.5))' }
        }
      }
    },
  },
  plugins: [],
}
