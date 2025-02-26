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
  currentUserId: string;
  lastMessage: ChatMessage | undefined;
  unreadMessagesCount: number | undefined;
};

export const UserItem = ({
  id,
  image,
  name,
  currentUserId,
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
          'flex items-center gap-2 px-2 py-4 hover:bg-primary-hover-light active:bg-primary-active-light dark:border-b-slate-800 dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark',
          {
            'bg-primary-hover-light dark:bg-primary-hover-dark': idFromPathname === id,
          }
        )}>
        <Avatar className="h-10 w-10">
          <AvatarImage
            className={cn(currentUserId && 'scale-75')}
            src={currentUserId === id ? '/svg/bookmark.svg' : (image ?? undefined)}
            alt={name ?? "user's avatar"}
          />
          <AvatarFallback className="text-sm">{getNameInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex w-full min-w-32 flex-col">
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-sm font-semibold">
              {currentUserId === id ? 'Notes' : name}
            </span>
            <span className="font-mono text-xs text-gray-400">{lastMessageTime}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            {lastMessage ? (
              <span className="line-clamp-1 min-w-[50%] max-w-[70%] text-ellipsis break-words text-sm">
                {lastMessage.senderId === currentUserId ? (
                  <i className="text-gray-500">You: </i>
                ) : null}
                {lastMessage.text}
              </span>
            ) : (
              <span className="text-sm italic text-gray-400">No messages</span>
            )}
            {unreadMessagesCount ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-highlight-light font-mono text-xs leading-none dark:bg-highlight-dark">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
};

export const UserItemMemo = React.memo(UserItem);
