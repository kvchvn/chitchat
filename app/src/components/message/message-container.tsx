import React, { forwardRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '~/lib/utils';

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
            console.log('set ref');
            firstUnreadMessageRef.current = el;
          }
        }}
        className={cn(
          'flex w-fit min-w-24 max-w-[80%] flex-col gap-2 whitespace-pre-line break-words rounded-3xl border py-1 leading-6',
          fromCurrentUser &&
            'self-message self-end border-primary-hover-light bg-primary-light dark:border-primary-hover-dark dark:bg-primary-dark',
          !fromCurrentUser && 'companion-message border-zinc-400',
          !fromCurrentUser && !isRead && 'bg-zinc-200 ring-1 ring-zinc-400 dark:bg-zinc-700'
        )}>
        {children}
      </li>
    );
  }
);

MessageContainer.displayName = 'MessageContainer';
