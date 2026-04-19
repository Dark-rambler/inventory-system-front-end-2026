/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Colores Principales
        primary: {
          DEFAULT: '#2f5f8f',
          50: '#eff5fb',
          100: '#dce8f5',
          200: '#bed3ea',
          300: '#94b6d9',
          400: '#6b97c6',
          500: '#4c7fb4',
          600: '#3b699a',
          700: '#31567e',
          800: '#2c4869',
          900: '#273d58',
        },
        secondary: {
          DEFAULT: '#2f746f',
          50: '#eef8f7',
          100: '#d6eeeb',
          200: '#b0ddd8',
          300: '#84c7c1',
          400: '#58ada6',
          500: '#3b938c',
          600: '#2f746f',
          700: '#295d59',
          800: '#254b48',
          900: '#213e3b',
        },
        // Colores de Fondos
        bg: {
          primary: '#F5F7FA',
          secondary: {
            1: '#EBF0F6',
            2: '#FAFBFD',
          },
        },

        // Colores Neutros
        black: '#1E1E1E',
        gray: {
          1: '#4A4A4A',
          2: '#7A7A7A',
          3: '#C7C7C7',
        },

        // Colores Semánticos
        success: '#2D9F5E',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#3B82F6',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Headings
        h1: ['48px', { lineHeight: '56px', fontWeight: '700' }],
        h2: ['36px', { lineHeight: '44px', fontWeight: '600' }],
        h3: ['28px', { lineHeight: '36px', fontWeight: '600' }],
        h4: ['20px', { lineHeight: '28px', fontWeight: '500' }],

        // Body y otros
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        small: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],

        // Tamaños adicionales estándar
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      height: {
        'btn-lg': '52px',
        'btn-md': '44px',
        'btn-sm': '36px',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        spinPause: 'spinPause 3s linear infinite',
      },
      keyframes: {
        spinPause: {
          '0%': { transform: 'rotate(0deg)' },
          '40%': { transform: 'rotate(720deg)' },
          '60%': { transform: 'rotate(720deg)' },
          '100%': { transform: 'rotate(1440deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%, 20%, 40%, 60%, 80%': { transform: 'translateY(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateY(-5px)' },
        },
      },
      zIndex: {
        1: '1',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [],
};
