/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
    "./js/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00BFA6',    // Verde Menta
        'dark': '#1A202C',       // Azul Noche  
        'light': '#F7F9FA',      // Gris Niebla
        'text-light': '#E2E8F0', // Texto blanco suave
        'text-dark': '#333333',  // Texto gris oscuro
      },
    },
  },
}