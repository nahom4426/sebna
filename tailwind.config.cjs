/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

 module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Sebna Brand Colors
        'sebna': {
          'navy': '#00174b',
          'orange': '#f43b11',
          'navy-light': '#00174b',
          'orange-light': '#f43b11',
        },
        // Custom colors for your existing theme
        'primary': '#00174b',
        'secondary': '#00174b',
        'accent': 'rgb(224 229 242)',
        'dark': 'rgb(32 34 36)',
        'text-clr': '#00174b',
        'base-clr': 'rgb(248 250 255)',
        'base-clr2': 'rgb(247 248 251)',
        'base-clr3': 'rgb(30 30 30)',
        'base-clr4': '#00174b',
        'base-clr5': '#00174b',
      },
      backgroundImage: {
        // Gradient backgrounds
        'sebna-gradient': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'sebna-gradient-reverse': 'linear-gradient(135deg, #f43b11 0%, #00174b 100%)',
        'sebna-gradient-light': 'linear-gradient(135deg, rgba(0, 23, 75, 0.1) 0%, rgba(244, 59, 17, 0.1) 100%)',
        'gradient-blue': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'gradient-purple': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'gradient-green': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'gradient-orange': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'gradient-indigo': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        // Card gradients
        'card-gradient-1': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'card-gradient-2': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'card-gradient-3': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'card-gradient-4': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
        'card-gradient-5': 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
      },
      animation: {
        // Loading animations
        'loading-bar': 'loadingBar 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'ripple': 'ripple 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideInRight: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          'from': { transform: 'translateY(30px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          'to': { opacity: '1' },
        },
        ripple: {
          '100%': { 
            width: 'var(--btnWidth)',
            height: 'var(--btnWidth)',
            opacity: '0',
          },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -3px rgba(0, 0, 0, 0.1), 0 15px 25px -2px rgba(0, 0, 0, 0.06)',
        'hard': '0 10px 30px -3px rgba(0, 0, 0, 0.15), 0 20px 40px -2px rgba(0, 0, 0, 0.08)',
        'sebna': '0 8px 25px rgba(30, 58, 138, 0.15)',
        'sebna-hover': '0 15px 35px rgba(30, 58, 138, 0.25)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      // Add drawer width variable
      width: {
        'drawer': '18rem',
      },
      height: {
        'navbar': '3.5rem',
      },
    },
    fontFamily: {
      'nunito': ['Nunito Sans', 'sans-serif'],
      'inter': ['Inter', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          background: 'linear-gradient(135deg, #00174b 0%, #f43b11 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.animate-stagger': {
          animation: 'fadeIn 0.6s ease-in-out forwards',
        },
        '.animate-stagger-delay-1': {
          animationDelay: '100ms',
        },
        '.animate-stagger-delay-2': {
          animationDelay: '200ms',
        },
        '.animate-stagger-delay-3': {
          animationDelay: '300ms',
        },
        '.animate-stagger-delay-4': {
          animationDelay: '400ms',
        },
        '.animate-stagger-delay-5': {
          animationDelay: '500ms',
        },
      };
      addUtilities(newUtilities);
    }
  ],
});