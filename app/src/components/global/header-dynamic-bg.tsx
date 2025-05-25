'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ROUTES } from '~/constants/routes';
import { cn } from '~/lib/utils';

export const HeaderDynamicBg = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setIsTop(!document.documentElement.scrollTop);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed z-2 flex h-12 w-full flex-col justify-center transition-colors duration-300 ease-in-out dark:bg-slate-700',
        {
          'bg-primary-hover-light dark:bg-primary-active-dark/55':
            pathname.startsWith(ROUTES.profile) && isTop,
          'bg-slate-100 shadow-md dark:bg-slate-700': pathname.startsWith(ROUTES.profile) && !isTop,
        }
      )}>
      {children}
    </header>
  );
};
