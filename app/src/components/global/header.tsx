'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ThemeToggler } from '~/components/ui/theme-toggler';
import { Wrapper } from '~/components/ui/wrapper';
import { ROUTES } from '~/constants/routes';
import { getNameInitials } from '~/lib/utils';
import { api } from '~/trpc/react';
import { HeaderLinkBack } from './header-link-back';

export const Header = () => {
  const { data: user } = api.users.getCurrent.useQuery();

  const nameInitials = getNameInitials(user?.name);

  return (
    <Wrapper className="flex items-center">
      <div className="flex w-full items-center gap-2">
        <HeaderLinkBack />
        <ThemeToggler className="ml-auto h-8 w-8 rounded-full" />
        <Link href={ROUTES.profile}>
          <Avatar>
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? 'Your avatar'}
              className="hover:contrast-125"
            />
            <AvatarFallback className="text-sm hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-600">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </Wrapper>
  );
};
