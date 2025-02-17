import '~/styles/globals.css';

import { type Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { Toaster } from '~/components/ui/toaster';
import { cn } from '~/lib/utils';
import { inter, jetBransMono, poppins } from '~/styles/fonts/font';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'chit-chat',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-dvh scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-400 [&.dark]:scrollbar-track-gray-800 [&.dark]:scrollbar-thumb-gray-950',
        inter.variable,
        jetBransMono.variable,
        poppins.variable
      )}>
      <body className="flex h-dvh flex-col items-stretch">
        <TRPCReactProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
