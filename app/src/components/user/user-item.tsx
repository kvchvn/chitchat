'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { cn, getHoursMinutes, getNameInitials } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';

type Props = {
  id: string;
  image: string | null;
  name: string | null;
  isCurrentUser: boolean;
  lastMessage: Pick<ChatMessage, 'id' | 'createdAt' | 'text'> | undefined;
  unreadMessagesCount: number | undefined;
};

export const UserItem = ({
  id,
  image,
  name,
  isCurrentUser,
  lastMessage,
  unreadMessagesCount,
}: Props) => {
  const pathname = usePathname();
  const idFromPathname = pathname.slice(1);
  const lastMessageTime = lastMessage ? getHoursMinutes(lastMessage.createdAt) : null;

  return (
    <li className="border-b last:border-b-0">
      <Link
        href={`/${id}`}
        className={clsx(
          'flex min-w-max items-center gap-2 px-2 py-4 hover:bg-primary-hover-light active:bg-primary-active-light dark:border-b-slate-800 dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark',
          {
            'bg-primary-hover-light dark:bg-primary-hover-dark': idFromPathname === id,
          }
        )}>
        <Avatar className="h-10 w-10">
          <AvatarImage
            className={cn(isCurrentUser && 'scale-75')}
            src={isCurrentUser ? '/svg/bookmark.svg' : (image ?? undefined)}
            alt={name ?? "user's avatar"}
          />
          <AvatarFallback className="text-sm">{getNameInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-32 flex-col">
          <span className="text-sm font-semibold">{isCurrentUser ? 'Notes' : name}</span>
          {lastMessage ? (
            <div className="flex gap-1 text-xs">
              <span className="font-mono text-gray-400">{lastMessageTime}</span>
              <span>|</span>
              <span className="line-clamp-1 max-w-40 text-ellipsis">{lastMessage.text}</span>
            </div>
          ) : (
            <span className="text-xs italic text-gray-400">No messages</span>
          )}
        </div>
        {unreadMessagesCount ? (
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-highlight-light font-mono text-xs leading-none dark:bg-highlight-dark">
            {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
          </span>
        ) : null}
      </Link>
    </li>
  );
};

export const UserItemMemo = React.memo(UserItem);
