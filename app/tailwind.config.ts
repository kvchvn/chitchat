import tailwindcssContainerQueries from '@tailwindcss/container-queries';
import tailwindScrollbar from 'tailwind-scrollbar';
import { type Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import colors from 'tailwindcss/colors';
import { withUt } from 'uploadthing/tw';

// withUt - uploadthing's
export default withUt({
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jbmono)'],
        title: ['var(--font-montserrat)'],
      },
      screens: {
        xs: '480px',
        '2xl': '1440px',
      },
      colors: {
        auth: {
          google: {
            DEFAULT: 'transparent',
            hover: {
              light: colors.slate['100'],
              dark: colors.slate['700'],
            },
            active: {
              light: colors.slate['200'],
              dark: colors.slate['600'],
            },
          },
          github: {
            DEFAULT: 'hsl(215 15.4% 15.3%)',
            hover: {
              light: 'hsl(215 15.4% 80%)',
              dark: 'hsl(215 20% 55%)',
            },
            active: {
              light: 'hsl(215 15.4% 70%)',
              dark: 'hsl(215 20% 50%)',
            },
          },
          yandex: {
            DEFAULT: 'hsl(9 97.4% 55.1%)',
            hover: {
              light: 'hsl(9 97.4% 75%)',
              dark: 'hsl(9 50% 40%)',
            },
            active: {
              light: 'hsl(9 85% 65%)',
              dark: 'hsl(9 50% 50%)',
            },
          },
          facebook: {
            DEFAULT: 'hsl(217 100% 51.6%)',
            hover: {
              light: 'hsl(217 100% 80%)',
              dark: 'hsl(217 50% 40%)',
            },
            active: {
              light: 'hsl(217 100% 65%)',
              dark: 'hsl(217 50% 50%)',
            },
          },
        },
        background: {
          light: colors.slate[50],
          dark: colors.slate[900],
        },
        primary: {
          light: colors.sky[100],
          dark: colors.sky[900],
          hover: {
            light: colors.sky[200],
            dark: colors.sky[800],
          },
          active: {
            light: colors.sky[300],
            dark: colors.sky[700],
          },
        },
        secondary: {
          light: colors.teal[100],
          dark: colors.teal[900],
          hover: {
            light: colors.teal[200],
            dark: colors.teal[800],
          },
          active: {
            light: colors.teal[300],
            dark: colors.teal[700],
          },
        },
        accent: {
          light: colors.indigo[100],
          dark: colors.indigo[900],
          hover: {
            light: colors.indigo[200],
            dark: colors.indigo[800],
          },
          active: {
            light: colors.indigo[300],
            dark: colors.indigo[700],
          },
        },
        muted: {
          light: colors.gray[100],
          dark: colors.gray[800],
        },
        highlight: {
          light: colors.amber[500],
          dark: colors.amber[900],
          hover: {
            light: colors.amber[400],
            dark: colors.amber[800],
          },
          active: {
            light: colors.amber[600],
            dark: colors.amber[700],
          },
        },
        success: {
          light: colors.emerald[500],
          dark: colors.emerald[600],
          hover: {
            light: colors.emerald[400],
            dark: colors.emerald[500],
          },
          active: {
            light: colors.emerald[600],
            dark: colors.emerald[700],
          },
        },
        error: {
          light: colors.red[400],
          dark: colors.red[900],
          hover: {
            light: colors.red[500],
            dark: colors.red[800],
          },
          active: {
            light: colors.red[600],
            dark: colors.red[700],
          },
        },
        gray: {
          light: colors.gray[200],
          dark: colors.gray[700],
        },
        text: {
          light: colors.gray[900],
          dark: colors.gray[200],
        },
        'text-muted': {
          light: colors.gray[500],
          dark: colors.gray[400],
        },
        ring: {
          light: colors.neutral[950],
          dark: colors.neutral[300],
        },
      },
      scale: {
        '30': '0.3',
      },
      zIndex: {
        '2': '2',
        '3': '3',
      },
      containers: {
        '2xs': '130px',
      },
      keyframes: {
        'new-message-pulse': {
          '0%, 100%': { 'background-color': 'transparent' },
          '50%': { 'background-color': colors.zinc[300] },
        },
        'new-message-pulse-dark': {
          '0%, 100%': { 'background-color': colors.zinc[600] },
          '50%': { 'background-color': 'transparent' },
        },
        'warning-bounce': {
          '0%, 15%, 25%, 100%': {
            transform: 'translateY(0)',
          },
          '10%, 20%': {
            transform: 'translateY(-40%)',
          },
        },
      },
      animation: {
        'new-message-pulse': '2s new-message-pulse ease-in-out infinite',
        'new-message-pulse-dark': '2s new-message-pulse-dark ease-in-out infinite',
        'avatar-upload-btn-bounce': '10s warning-bounce 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssContainerQueries,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    tailwindScrollbar({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    }),
  ],
}) satisfies Config;
