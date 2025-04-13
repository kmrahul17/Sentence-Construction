/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: { scale: {
      '102': '1.02'
    }, animation: {
      bounce: 'bounce 1s infinite',width: {
        'sidebar': '320px' // Custom width for sidebar components
      },gridTemplateColumns: {
        'custom': '2.5fr 1.5fr' // Custom grid columns ratio
      }
    }},
  },
  plugins: [],
};
