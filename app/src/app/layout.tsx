import '~/styles/globals.css';

import * as Sentry from '@sentry/nextjs';
import { type Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '~/components/ui/toaster';
import { cn } from '~/lib/utils';
import { inter, jetBransMono } from '~/styles/fonts/font';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'Chit-Chat',
  icons: [{ rel: 'icon', url: '/favicon.png' }],
  other: {
    ...Sentry.getTraceData(),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-dvh overflow-x-hidden scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-400 [&.dark]:scrollbar-track-gray-800 [&.dark]:scrollbar-thumb-gray-950',
        inter.variable,
        jetBransMono.variable
      )}>
      <body className="flex min-h-dvh flex-col items-stretch">
        <TRPCReactProvider>
          <ThemeProvider attribute="class" enableSystem={false}>
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
