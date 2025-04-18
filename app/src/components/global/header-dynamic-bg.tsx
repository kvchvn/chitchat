'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { ROUTES } from '~/constants/routes';
import { cn } from '~/lib/utils';

export const HeaderDynamicBg = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();

  return (
    <header
      className={cn('fixed z-2 w-full py-2', {
        'bg-primary-hover-light dark:bg-primary-active-dark/55': pathname.startsWith(
          ROUTES.profile
        ),
      })}>
      {children}
    </header>
  );
};
