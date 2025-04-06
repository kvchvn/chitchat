import React, { forwardRef, memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  messageId: string;
  fromCurrentUser: boolean;
  unreadMessages: Set<string>;
  isRead: boolean;
  isEditing: boolean;
};

const MessageContainer = forwardRef<HTMLLIElement | null, Props>(
  (
    { children, messageId, fromCurrentUser, unreadMessages, isRead, isEditing },
    firstUnreadMessageRef
  ) => {
    const { ref: inViewRef, inView } = useInView({ threshold: 1, delay: 100 });

    useEffect(() => {
      if (inView && !isRead && !fromCurrentUser) {
        unreadMessages.add(messageId);
      }
    }, [inView, isRead, fromCurrentUser, unreadMessages, messageId]);

    useEffect(() => {
      if (isRead) {
        unreadMessages.delete(messageId);
      }
    }, [isRead, messageId, unreadMessages]);

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
        <div
          className={cn(
            'relative flex w-fit min-w-24 max-w-[80%] flex-col gap-2 whitespace-pre-line break-words rounded-3xl border py-1 leading-6',
            {
              'border-primary-hover-light bg-primary-light dark:border-primary-hover-dark dark:bg-primary-dark':
                fromCurrentUser,
              'border-zinc-400': !fromCurrentUser,
              'animate-new-message-pulse dark:animate-new-message-pulse-dark':
                !fromCurrentUser && !isRead,
              'bg-primary-hover-light dark:bg-primary-active-dark/10': isEditing,
            }
          )}>
          {children}
        </div>
      </li>
    );
  }
);

export const MessageContainerMemo = memo(MessageContainer, (oldProps, newProps) => {
  return Boolean(
    oldProps.fromCurrentUser === newProps.fromCurrentUser &&
      oldProps.isRead === newProps.isRead &&
      oldProps.isEditing === newProps.isEditing &&
      oldProps.messageId === newProps.messageId &&
      [...oldProps.unreadMessages].join('') === [...newProps.unreadMessages].join('')
  );
});

MessageContainer.displayName = 'MessageContainer';
