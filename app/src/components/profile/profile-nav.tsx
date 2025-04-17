'use client';

import { cva } from 'class-variance-authority';
import { LogOut, Settings, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '~/constants/routes';
import { Button } from '../ui/button';

const navItemVariants = cva('active:bg-slate-300', {
  variants: {
    variant: {
      default: '',
      destructive:
        'text-error-hover-light hover:text-error-hover-light dark:text-error-hover-dark dark:hover:text-error-hover-dark',
    },
    active: {
      true: 'bg-slate-300 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-600',
      false: null,
    },
    defaultVariants: {
      variant: 'default',
      active: false,
    },
  },
});

export const ProfileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex h-fit min-w-36 flex-col gap-4">
      <Button variant="ghost" asChild>
        <Link
          href={ROUTES.profile}
          className={navItemVariants({ active: pathname === ROUTES.profile })}>
          <UserRoundPen />
          Personal
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link
          href={ROUTES.profileSettings}
          className={navItemVariants({ active: pathname === ROUTES.profileSettings })}>
          <Settings />
          Settings
        </Link>
      </Button>
      <Button variant="ghost" className={navItemVariants({ variant: 'destructive' })}>
        <LogOut />
        Sign out
      </Button>
    </nav>
  );
};
