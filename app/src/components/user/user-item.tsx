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
import { Indicator } from '../ui/indicator';

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

  const isUsersNotes = userId === id;
  const formattedName = isUsersNotes ? NOTES_TITLE : name;

  return (
    <li
      className={cn(
        'p-[2px] last:border-b-0 hover:bg-primary-hover-light active:bg-primary-active-light dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark lg:border-b',
        {
          'opacity-40': isBlocked,
          'bg-primary-hover-light dark:bg-primary-hover-dark': companionId === id,
        }
      )}>
      <Link
        href={`/${id}`}
        className={clsx(
          'focus-ring-default relative flex items-center gap-2 px-4 py-4 max-lg:rounded-[3rem] lg:px-2'
        )}>
        <Avatar className={cn('h-10 w-10', isUsersNotes && 'rounded-none')}>
          <AvatarImage
            src={isUsersNotes ? '/svg/bookmark.svg' : (image ?? undefined)}
            alt={formattedName ?? ''}
            className={cn(isUsersNotes && 'bg-transparent dark:bg-transparent')}
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
            <Indicator
              count={unreadMessagesCount}
              className="absolute left-1 top-1 @2xs:static @2xs:border-none"
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

export const UserItemMemo = React.memo(UserItem);
