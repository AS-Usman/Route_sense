/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FFF7ED',         // Warm cream background
          secondary: '#FFEDD5',  // Secondary peach background
          card: '#FFFFFF',       // Clean white card surface
          cardHover: '#FFFBF5',  // Subtle hover card
          peach: '#FED7AA',      // Soft peach
          darkOrange: '#C2410C', // Dark orange
        },
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',        // Primary vibrant orange
          600: '#EA580C',
          700: '#C2410C',        // Dark warm orange
          800: '#9A3412',
          900: '#7C2D12',
        },
        stone: {
          800: '#292524',        // Primary text
          600: '#57534E',
          500: '#78716C',        // Secondary muted text
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(194, 65, 12, 0.05)',
        'warm-md': '0 4px 6px -1px rgba(194, 65, 12, 0.08), 0 2px 4px -2px rgba(194, 65, 12, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(194, 65, 12, 0.1), 0 4px 6px -4px rgba(194, 65, 12, 0.08)',
        'warm-xl': '0 20px 25px -5px rgba(194, 65, 12, 0.12), 0 8px 10px -6px rgba(194, 65, 12, 0.08)',
        'glow-orange': '0 0 25px rgba(249, 115, 22, 0.25)',
        'glow-orange-lg': '0 0 45px rgba(249, 115, 22, 0.35)',
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-warm': 'pulseWarm 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseWarm: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
