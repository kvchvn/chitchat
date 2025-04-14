'use client';

import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { useUserId } from '~/components/contexts/user-id-provider';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { NOTES_TITLE } from '~/constants/global';
import { useCompanionId } from '~/hooks/use-companion-id';
import { cn, getHoursMinutes, getNameInitials } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';

type Props = {
  id: string;
  image: string | null;
  name: string | null;
  lastMessage: ChatMessage | undefined;
  unreadMessagesCount: number | undefined;
  isBlocked: boolean;
};

export const UserItem = ({
  id,
  image,
  name,
  lastMessage,
  unreadMessagesCount,
  isBlocked,
}: Props) => {
  const userId = useUserId();
  const companionId = useCompanionId();
  const lastMessageTime = lastMessage ? getHoursMinutes(lastMessage.createdAt) : null;

  const formattedName = userId === id ? NOTES_TITLE : name;

  return (
    <li className={cn('border-b last:border-b-0', isBlocked && 'opacity-40')}>
      <Link
        href={`/${id}`}
        className={clsx(
          'relative flex items-center gap-2 px-2 py-4 hover:bg-primary-hover-light active:bg-primary-active-light dark:border-b-slate-800 dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark',
          {
            'bg-primary-hover-light dark:bg-primary-hover-dark': companionId === id,
          }
        )}>
        <Avatar className={cn('h-10 w-10', userId === id && 'rounded-none')}>
          <AvatarImage
            src={userId === id ? '/svg/bookmark.svg' : (image ?? undefined)}
            alt={formattedName ?? ''}
          />
          <AvatarFallback className="text-sm">{getNameInitials(formattedName)}</AvatarFallback>
        </Avatar>
        <div className="flex w-full min-w-32 flex-col @container">
          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-sm font-semibold">{formattedName}</span>
            <span className="cursor-default font-mono text-xs text-gray-400">
              {lastMessageTime}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            {lastMessage ? (
              <div className="flex max-w-[70%] items-center gap-1 text-sm">
                {lastMessage.senderId === userId ? <i className="text-gray-500">You: </i> : null}
                <span className="line-clamp-1 text-ellipsis break-words">{lastMessage.text}</span>
              </div>
            ) : (
              <span className="text-sm italic text-gray-400">No messages</span>
            )}
            {unreadMessagesCount ? (
              <span className="border- absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-current bg-highlight-light font-mono text-xs leading-none @2xs:static @2xs:border-none dark:bg-highlight-dark">
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
