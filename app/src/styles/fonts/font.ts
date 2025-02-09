import localFont from 'next/font/local';

export const inter = localFont({
  src: './InterTight.ttf',
  variable: '--font-inter',
});

export const jetBransMono = localFont({
  src: './JetBrainsMono.ttf',
  variable: '--font-jbmono',
});

export const poppins = localFont({
  src: [
    { path: './Poppins-Medium.ttf', weight: '500' },
    { path: './Poppins-Regular.ttf', weight: '400' },
    { path: './Poppins-SemiBold.ttf', weight: '600' },
  ],
  variable: '--font-poppins',
});
