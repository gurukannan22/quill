/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        quill: {
          purple: {
            50:  '#EEEDFE',
            100: '#CECBF6',
            400: '#7F77DD',
            600: '#534AB7',
            800: '#3C3489',
          },
        }
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        slideDown: 'slideDown 200ms ease-out',
      }
    },
  },
  plugins: [],
}
