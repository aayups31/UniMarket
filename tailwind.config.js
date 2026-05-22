
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        uw: {
          gold: '#FFD100',
          black: '#0E0E12',
          card: '#18181D',
          elevated: '#1F1F26',
          border: '#26262E',
          gray: '#A0A0A0'
        }
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'float': '0 12px 30px -5px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 40px -10px rgba(255, 209, 0, 0.15)',
        'glow-strong': '0 0 60px -15px rgba(255, 209, 0, 0.3)',
        '3d': '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
