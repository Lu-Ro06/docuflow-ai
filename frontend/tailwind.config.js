/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'docu-dark': '#0b1120',    // Fondo marino profundo
        'docu-blue': '#2563eb',    // Tu azul de trabajo
        'docu-accent': '#38bdf8',  // Azul para IA
        'docu-card': '#1e293b',    // Fondo de tarjetas
      },
    },
  },
  plugins: [],
}