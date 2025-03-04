import { EllipsisVertical } from 'lucide-react';
import React, { forwardRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';

type Props = React.PropsWithChildren & {
  messageId: string;
  fromCurrentUser: boolean;
  unreadMessages: Set<string>;
  isRead: boolean;
};

export const MessageContainer = forwardRef<HTMLLIElement | null, Props>(
  ({ children, messageId, fromCurrentUser, unreadMessages, isRead }, firstUnreadMessageRef) => {
    const { ref: inViewRef, inView } = useInView({ threshold: 1 });

    if (inView && !isRead && !fromCurrentUser) {
      unreadMessages.add(messageId);
    }

    if (isRead) {
      unreadMessages.delete(messageId);
    }

    return (
      <li
        ref={(el) => {
          inViewRef(el);

          if (
            firstUnreadMessageRef &&
            'current' in firstUnreadMessageRef &&
            !firstUnreadMessageRef.current &&
            !fromCurrentUser &&
            !isRead
          ) {
            firstUnreadMessageRef.current = el;
          }
        }}
        className={cn(
          'group flex w-full items-end justify-end gap-1',
          fromCurrentUser && 'self-message self-end',
          !fromCurrentUser && 'companion-message flex-row-reverse'
        )}>
        <Button size="icon-xs" variant="ghost" className="invisible group-hover:visible">
          <EllipsisVertical />
        </Button>
        <div
          className={cn(
            'flex w-fit min-w-24 max-w-[80%] flex-col gap-2 whitespace-pre-line break-words rounded-3xl border py-1 leading-6',
            fromCurrentUser &&
              'border-primary-hover-light bg-primary-light dark:border-primary-hover-dark dark:bg-primary-dark',
            !fromCurrentUser && 'border-zinc-400',
            !fromCurrentUser && !isRead && 'bg-zinc-200 ring-1 ring-zinc-400 dark:bg-zinc-700'
          )}>
          {children}
        </div>
      </li>
    );
  }
);

MessageContainer.displayName = 'MessageContainer';
