import React from 'react';
import { WelcomeConfetti } from '~/components/auth/welcome-confetti';
import { ThemeToggler } from '~/components/ui/theme-toggler';

export default function SignInLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="relative flex h-dvh items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark">
      <section className="z-2 mx-4 flex max-h-[95dvh] w-full max-w-full flex-col items-center gap-6 overflow-y-auto rounded-xl border border-gray-light bg-white px-6 py-12 text-center dark:border-transparent dark:bg-gray-950 dark:text-text-dark max-xs:py-6 xs:w-[520px] xs:px-14 xs:py-10">
        {children}
      </section>
      <WelcomeConfetti />
      <ThemeToggler className="absolute bottom-4 right-4" />
    </main>
  );
}
