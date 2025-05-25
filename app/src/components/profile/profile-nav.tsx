'use client';

import { cva } from 'class-variance-authority';
import { EllipsisVertical, LogOut, UserRoundPen, UserRoundX } from 'lucide-react';
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
import { ProfileNavSkeleton } from './profile-nav-skeleton';
import { RemoveAccountAlertDialog } from './remove-account-alert-dialog';
import { SignOutAlertDialog } from './sign-out-alert-dialog';

const navItemVariants = cva('flex items-center justify-start gap-2 active:bg-slate-300 text-md', {
  variants: {
    variant: {
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
  const signOutAlertDialogTriggerRef = useRef<HTMLButtonElement | null>(null);
  const removeAccountAlertDialogTriggerRef = useRef<HTMLButtonElement | null>(null);

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
            <SignOutAlertDialog>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  signOutAlertDialogTriggerRef.current?.click();
                }}
                className={navItemVariants({ variant: 'destructive' })}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
              <AlertDialogTrigger className="hidden" ref={signOutAlertDialogTriggerRef} />
            </SignOutAlertDialog>
            <RemoveAccountAlertDialog>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeAccountAlertDialogTriggerRef.current?.click();
                }}
                className={navItemVariants({ variant: 'destructive' })}>
                <UserRoundX />
                Remove account
              </DropdownMenuItem>
              <AlertDialogTrigger className="hidden" ref={removeAccountAlertDialogTriggerRef} />
            </RemoveAccountAlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  } else if (isMoreOrEqualThanBreakpoint) {
    return (
      <nav className="sticky top-16 flex h-fit min-w-52 flex-col gap-4">
        <Button
          variant="ghost"
          asChild
          className={navItemVariants({ active: pathname === ROUTES.profile })}>
          <Link href={ROUTES.profile}>
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
        <SignOutAlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={navItemVariants({ variant: 'destructive' })}>
              <LogOut />
              Sign out
            </Button>
          </AlertDialogTrigger>
        </SignOutAlertDialog>
        <RemoveAccountAlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={navItemVariants({ variant: 'destructive' })}>
              <UserRoundX />
              Remove account
            </Button>
          </AlertDialogTrigger>
        </RemoveAccountAlertDialog>
      </nav>
    );
  }
};
