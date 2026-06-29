/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        quill: {
          purple: {
            50:  '#EEEDFE',
            100: '#CECBF6',
            400: '#7F77DD',
            500: '#6B63D4',
            600: '#534AB7',
            700: '#4540A0',
            800: '#3C3489',
          },
          dark: {
            900: '#0f0f13',
            800: '#16161d',
            700: '#1e1e28',
            600: '#262634',
            500: '#323244',
            400: '#3e3e54',
          }
        }
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse_ring: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(127, 119, 221, 0.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(127, 119, 221, 0)' },
        }
      },
      animation: {
        slideDown: 'slideDown 200ms ease-out',
        slideUp: 'slideUp 200ms ease-out',
        fadeIn: 'fadeIn 150ms ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
        pulse_ring: 'pulse_ring 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.04) 50%, transparent 75%)',
      },
    },
  },
  plugins: [],
}
