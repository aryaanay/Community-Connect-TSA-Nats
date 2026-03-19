import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#EBF7FF',
          100: '#C6EBFF',
          200: '#90D4F7',
          300: '#56BBF0',
          400: '#2499D6',
          500: '#0D7BB5',
          600: '#085D8A',
          700: '#044069',
          800: '#022747',
          900: '#011629',
        },
        'cloud-white': '#EEF8FF',
        'deep-blue': '#1A4B6E',
        accent: {
          coral: '#FF6B55',
          warm: '#FF8C42',
        },
        glass: {
          bg: 'rgba(255,255,255,0.18)',
          'bg-md': 'rgba(255,255,255,0.28)',
          'bg-dark': 'rgba(20,60,90,0.25)',
          border: 'rgba(255,255,255,0.45)',
          'border-md': 'rgba(255,255,255,0.6)',
          blur: 'blur(18px)',
        }
      },
      fontFamily: {
        syne: ['Plus Jakarta Sans', 'sans-serif'],
        'dm-sans': ['Nunito', 'sans-serif'],
        space: ['DM Sans', 'sans-serif'],
        outfit: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        pill: '999px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '10px',
        md: '18px',
        lg: '28px',
        xl: '40px',
        '2xl': '64px',
      },
      filter: {
        'saturate-180': 'saturate(1.8)',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(4,64,105,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
        'glass-lg': '0 16px 48px rgba(4,64,105,0.25), inset 0 1px 0 rgba(255,255,255,0.55)',
        card: '0 4px 24px rgba(4,64,105,0.12)',
        'card-hover': '0 24px 56px rgba(4,64,105,0.18)',
        'glass-inner': 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.1)',
        'light-gradient': '0 1px 0 rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.1)',
        bento: '0 20px 40px -10px rgba(4,64,105,0.2)',
        'bento-hover': '0 35px 60px -15px rgba(4,64,105,0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease both',
        'pulse-slow': 'pulse 2s ease infinite',
        'orb-float': 'orbFloat 8s ease-in-out infinite',
        'ticker': 'tickerScroll 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.3)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-30px) scale(1.05)' },
        },
        tickerScroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

