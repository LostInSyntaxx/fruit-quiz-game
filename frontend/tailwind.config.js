/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        foreground: '#f5f5f5',
        card: '#202020',
        'card-foreground': '#f5f5f5',
        popover: '#202020',
        'popover-foreground': '#f5f5f5',
        primary: {
          DEFAULT: '#0078f2',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#2a2a2a',
          foreground: '#f5f5f5',
        },
        muted: {
          DEFAULT: '#2a2a2a',
          foreground: '#a0a0a0',
        },
        accent: {
          DEFAULT: '#2a2a2a',
          foreground: '#f5f5f5',
        },
        destructive: {
          DEFAULT: '#be1e2d',
          foreground: '#ffffff',
        },
        border: '#333333',
        input: '#333333',
        ring: '#0078f2',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
