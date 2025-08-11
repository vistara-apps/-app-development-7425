/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220 100% 50%)',
        accent: 'hsl(30 100% 55%)',
        bg: 'hsl(230 15% 10%)',
        surface: 'hsl(230 15% 15%)',
        'surface-elevated': 'hsl(230 15% 18%)',
        textPrimary: 'hsl(0 0% 98%)',
        textSecondary: 'hsl(0 0% 70%)',
        success: 'hsl(142 76% 36%)',
        warning: 'hsl(38 92% 50%)',
        error: 'hsl(0 84% 60%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '20px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0,0%,0%,0.2)',
        'card-hover': '0 8px 24px hsla(0,0%,0%,0.3)',
        'cosmic': '0 0 20px hsla(220, 100%, 50%, 0.3), 0 4px 12px hsla(0, 0%, 0%, 0.4)',
        'cosmic-accent': '0 0 20px hsla(30, 100%, 55%, 0.3), 0 4px 12px hsla(0, 0%, 0%, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px hsla(220, 100%, 50%, 0.3)' },
          '100%': { boxShadow: '0 0 30px hsla(220, 100%, 50%, 0.6)' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
