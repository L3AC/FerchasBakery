/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores originales del logo FerchasBakery
        'ferchas-rosa': '#DF9CB4',
        'ferchas-rosa-oscuro': '#C4889A',
        'ferchas-rosa-suave': '#EBCED6',
        'ferchas-fondo': '#F0F0F0',
        'ferchas-fondo-oscuro': '#E5E5E5',
        'ferchas-cafe': '#381414',
        'ferchas-cafe-claro': '#5A3A3A',
        'ferchas-vino': '#4A1818',
        'ferchas-vino-claro': '#6B2828',
        // Estados
        'ferchas-exito': '#8FB996',
        'ferchas-advertencia': '#D4A574',
        'ferchas-error': '#C47B7B',
      },
      fontFamily: {
        'titulo': ['Playfair Display', 'serif'],
        'cuerpo': ['Lato', 'sans-serif'],
      },
      spacing: {
        'artesanal-xs': '6px',
        'artesanal-sm': '14px',
        'artesanal-md': '22px',
        'artesanal-lg': '38px',
        'artesanal-xl': '52px',
      }
    },
  },
  plugins: [],
}
