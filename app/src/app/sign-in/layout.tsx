import React from 'react';
import { ThemeToggler } from './_components/theme-toggler';

export default function SignInLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="relative flex h-dvh items-center justify-center overflow-y-hidden bg-background-light dark:bg-background-dark">
      <section className="xs:w-[420px] xs:px-14 xs:py-10 mx-4 flex max-w-full flex-col items-center gap-6 rounded-xl border border-gray-light bg-white px-6 py-12 text-center dark:border-transparent dark:bg-gray-950 dark:text-text-dark">
        {children}
      </section>
      <ThemeToggler />
    </main>
  );
}
