'use client';

import { cva } from 'class-variance-authority';
import { EllipsisVertical, LogOut, UserRoundPen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { ROUTES } from '~/constants/routes';
import { useMediaQuery } from '~/hooks/use-media-query';
import { AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOutAlertDialog } from './log-out-alert-dialog';
import { ProfileNavSkeleton } from './profile-nav-skeleton';

const navItemVariants = cva('flex items-center gap-2 active:bg-slate-300 text-md', {
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
  const { isClient, isLessThanBreakpoint, isMoreOrEqualThanBreakpoint } = useMediaQuery('lg');
  const alertDialogTriggerRef = useRef<HTMLButtonElement | null>(null);

  if (!isClient) {
    return <ProfileNavSkeleton navItemsCount={3} />;
  }

  if (isLessThanBreakpoint) {
    return (
      <div className="absolute -translate-y-[calc(100%+8px)]">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon-lg" variant="outline" className="">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="flex flex-col gap-1">
            <DropdownMenuItem
              asChild
              className={navItemVariants({ active: pathname === ROUTES.profile })}>
              <Link href={ROUTES.profile}>
                <UserRoundPen />
                Personal
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
          <Link
            href={ROUTES.profileSettings}
            className={navItemVariants({ active: pathname === ROUTES.profileSettings })}>
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem> */}
            <LogOutAlertDialog>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  alertDialogTriggerRef.current?.click();
                }}
                className={navItemVariants({ variant: 'destructive' })}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
              <AlertDialogTrigger ref={alertDialogTriggerRef} />
            </LogOutAlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  } else if (isMoreOrEqualThanBreakpoint) {
    return (
      <nav className="sticky top-16 flex h-fit min-w-36 flex-col gap-4">
        <Button variant="ghost" asChild>
          <Link
            href={ROUTES.profile}
            className={navItemVariants({ active: pathname === ROUTES.profile })}>
            <UserRoundPen />
            Personal
          </Link>
        </Button>
        {/* <Button variant="ghost" asChild>
          <Link
            href={ROUTES.profileSettings}
            className={navItemVariants({ active: pathname === ROUTES.profileSettings })}>
            <Settings />
            Settings
          </Link>
        </Button> */}
        <LogOutAlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={navItemVariants({ variant: 'destructive' })}>
              <LogOut />
              Sign out
            </Button>
          </AlertDialogTrigger>
        </LogOutAlertDialog>
      </nav>
    );
  }
};
