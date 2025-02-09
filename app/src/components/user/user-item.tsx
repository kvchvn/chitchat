'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getNameInitials } from '~/lib/utils';

type Props = {
  id: string;
  image: string | null;
  name: string | null;
};

export const UserItem = ({ id, image, name }: Props) => {
  const pathname = usePathname();
  const idFromPathname = pathname.slice(1);

  return (
    <li className="mr-2 border-b last:border-b-0">
      <Link
        href={`/${id}`}
        className={clsx(
          'flex min-w-max items-center gap-2 py-4 pl-2 hover:bg-primary-hover-light active:bg-primary-active-light dark:border-b-slate-800 dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark',
          {
            'bg-primary-hover-light dark:bg-primary-hover-dark': idFromPathname === id,
          }
        )}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={image ?? undefined} alt={name ?? "user's avatar"} />
          <AvatarFallback className="text-sm">{getNameInitials(name)}</AvatarFallback>
        </Avatar>
        <span>{name}</span>
      </Link>
    </li>
  );
};

export const UserItemMemo = React.memo(UserItem);
