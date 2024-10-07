import { Inter, JetBrains_Mono, Poppins } from 'next/font/google';

export const inter = Inter({
  weight: ['200', '400', '500', '600'],
  variable: '--font-inter',
  subsets: ['cyrillic', 'latin'],
});

export const jetBransMono = JetBrains_Mono({
  weight: ['300', '400', '600'],
  variable: '--font-jbmono',
  subsets: ['cyrillic', 'latin'],
});

export const poppins = Poppins({
  weight: ['500', '600'],
  variable: '--font-poppins',
  subsets: ['latin'],
});
