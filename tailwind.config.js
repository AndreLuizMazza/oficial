/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: { card: '0 12px 30px rgba(2,6,23,.06)' },
      borderRadius: { xl2: '1.25rem' }
    }
  },
  plugins: []
}
