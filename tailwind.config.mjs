/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // Importamos el plugin

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'base': '#0d1b2a', // Azul oscuro de fondo
        'text-color': '#e0f2ff', // Texto principal (blanco azulado)
        'accent-cyan': '#00ffff',
        'accent-magenta': '#ff00ff',
      },
      fontFamily: {
        heading: ['Jura', 'sans-serif'],
        body: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [
    typography(), // Activamos el plugin aquí
  ],
}