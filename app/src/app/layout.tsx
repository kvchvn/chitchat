import '~/styles/globals.css';

import { type Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { inter, jetBransMono, poppins } from '~/styles/fonts/font';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'Chit-Chat v2',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetBransMono.variable} ${poppins.variable}`}
    >
      <body className="flex min-h-dvh flex-col items-stretch">
        <TRPCReactProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
