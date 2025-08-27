/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Granjas Maysol brand colors from Next.js project
        'primary': '#da3414',
        'secondary': '#fb540c',
        'accent': '#e84118',
        'light': '#f8f9fa',
        'dark': '#2d3436',
        'muted': '#b2bec3',
        'success': '#20bf6b',
        'warning': '#f7b731',
        'card-bg': '#ffffff',
        'section-bg': '#f5f7f9',
        'navbar-end': '#c12e0e',
        'orange-maysol': '#ffa500',
      },
      
      fontFamily: {
        'sans': ['Inter', 'Open Sans', 'sans-serif'],
        'heading': ['Poppins', 'sans-serif'],
      },
      
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      backgroundImage: {
        'navbar-gradient': 'linear-gradient(to right, #da3414, #c12e0e)',
        'btn-gradient': 'linear-gradient(135deg, rgb(255, 128, 103) 0%, rgb(218, 52, 20) 100%)',
        'btn-hover-gradient': 'linear-gradient(135deg, rgb(252, 87, 55) 0%, rgb(197, 45, 16) 100%)',
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      
      boxShadow: {
        'navbar': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        maysol: {
          "primary": "#da3414",
          "secondary": "#fb540c", 
          "accent": "#e84118",
          "neutral": "#2d3436",
          "base-100": "#ffffff",
          "base-200": "#f5f7f9",
          "base-300": "#b2bec3",
          "success": "#20bf6b",
          "warning": "#f7b731",
          "info": "#1877f2"
        }
      }
    ]
  }
}