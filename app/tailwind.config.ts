import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.tsx'],
  darkMode: 'selector',
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
        },
        secondary: {
          light: colors.teal[100],
          dark: colors.teal[900],
        },
        accent: {
          light: colors.indigo[100],
          dark: colors.indigo[900],
        },
        muted: {
          light: colors.gray[100],
          dark: colors.gray[800],
        },
        highlight: {
          light: colors.amber[100],
          dark: colors.amber[900],
        },
        success: {
          light: colors.emerald[100],
          dark: colors.emerald[900],
        },
        error: {
          light: colors.rose[100],
          dark: colors.rose[900],
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
  plugins: [],
} satisfies Config;
