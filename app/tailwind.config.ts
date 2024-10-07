import { type Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jbmono)'],
        title: ['var(--font-poppins)'],
      },
      colors: {
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
          light: colors.amber[100],
          dark: colors.amber[900],
          hover: {
            light: colors.amber[200],
            dark: colors.amber[800],
          },
          active: {
            light: colors.amber[300],
            dark: colors.amber[700],
          },
        },
        success: {
          light: colors.emerald[100],
          dark: colors.emerald[900],
          hover: {
            light: colors.emerald[200],
            dark: colors.emerald[800],
          },
          active: {
            light: colors.emerald[300],
            dark: colors.emerald[700],
          },
        },
        error: {
          light: colors.rose[100],
          dark: colors.rose[900],
          hover: {
            light: colors.rose[200],
            dark: colors.rose[800],
          },
          active: {
            light: colors.rose[300],
            dark: colors.rose[700],
          },
        },
        gray: {
          light: colors.gray[200],
          dark: colors.gray[700],
        },
        text: {
          light: colors.gray[900],
          dark: colors.gray[100],
        },
        'text-muted': {
          light: colors.gray[500],
          dark: colors.gray[400],
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
