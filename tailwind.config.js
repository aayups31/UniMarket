/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', '"Arial Narrow"', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        um: {
          ink: {
            1000: '#05070A',
            950: '#080B12',
            900: '#0D111A',
            850: '#141923',
            800: '#1B212C',
          },
          canvas: '#F7F5F0',
          'canvas-soft': '#FBFAF7',
          surface: '#FFFFFF',
          'surface-warm': '#F1EEE7',
          gold: {
            300: '#FFE889',
            400: '#FFD84F',
            500: '#FFC928',
            600: '#DFA600',
            700: '#8A6200',
          },
          text: {
            strong: '#111318',
            DEFAULT: '#333842',
            muted: '#626975',
            inverse: '#F7F7F4',
          },
          success: '#117448',
          warning: '#8A5A00',
          danger: '#B02D37',
          info: '#285BBD',
        },
        uw: {
          gold: '#FFC928',
          black: '#080B12',
          card: '#18181D',
          elevated: '#1F1F26',
          border: '#26262E',
          gray: '#A0A0A0',
        },
      },
      boxShadow: {
        'um-xs': '0 1px 2px rgba(12, 15, 20, 0.05)',
        'um-sm': '0 8px 22px rgba(12, 15, 20, 0.08)',
        'um-md': '0 18px 45px rgba(12, 15, 20, 0.12)',
        'um-gold': '0 18px 55px rgba(223, 166, 0, 0.12)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        float: '0 12px 30px -5px rgba(0, 0, 0, 0.6)',
        glow: '0 0 40px -10px rgba(255, 209, 0, 0.15)',
        'glow-strong': '0 0 60px -15px rgba(255, 209, 0, 0.3)',
        '3d': '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'um-xs': '0.5rem',
        'um-sm': '0.75rem',
        'um-md': '1rem',
        'um-lg': '1.375rem',
        'um-xl': '1.875rem',
      },
      maxWidth: {
        'um-shell': '100rem',
        'um-content': '82.5rem',
        'um-form': '53.75rem',
        'um-reading': '45rem',
      },
      transitionTimingFunction: {
        'um-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        160: '160ms',
        220: '220ms',
        300: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
