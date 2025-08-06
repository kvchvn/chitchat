import React, { forwardRef, memo, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLikeMessageOptimisticMutation } from '~/hooks/mutations/use-like-message-optimistic-mutation';
import { cn, generateChatDateKey } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';
import { useUserId } from '../contexts/user-id-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MessageSettingsDropdownItems } from './message-settings-dropdown-items';

type Props = React.PropsWithChildren & {
  message: ChatMessage;
  isEditing: boolean;
  isBlockedChat: boolean;
  unreadMessages: Set<string>;
  isActiveSearchMessage: boolean;
};

const MessageContainer = forwardRef<HTMLLIElement | null, Props>(
  (
    { children, unreadMessages, message, isEditing, isBlockedChat, isActiveSearchMessage },
    firstUnreadMessageRef
  ) => {
    const { ref: inViewRef, inView, entry } = useInView({ threshold: 1, delay: 100 });
    const containerRef = useRef<HTMLDivElement | null>(null);
    const userId = useUserId();

    const { mutate: toggleLikeMessage } = useLikeMessageOptimisticMutation();

    const handleDoubleClick: React.MouseEventHandler = (e) => {
      e.preventDefault();

      const dateKey = generateChatDateKey(message.createdAt);
      toggleLikeMessage({ id: message.id, dateKey, like: !message.isLiked });
    };

    useEffect(() => {
      if (inView && !message.isRead && message.senderId !== userId) {
        unreadMessages.add(message.id);
      }
    }, [inView, message.isRead, message.senderId, userId, unreadMessages, message.id]);

    useEffect(() => {
      if (message.isRead) {
        unreadMessages.delete(message.id);
      }
    }, [message.isRead, message.id, unreadMessages]);

    useEffect(() => {
      // scroll to active message in search
      if (isActiveSearchMessage) {
        entry?.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, [isActiveSearchMessage, entry?.target]);

    return (
      <li
        ref={(el) => {
          inViewRef(el);

          if (
            firstUnreadMessageRef &&
            'current' in firstUnreadMessageRef &&
            !firstUnreadMessageRef.current &&
            message.senderId !== userId &&
            !message.isRead
          ) {
            firstUnreadMessageRef.current = el;
          }
        }}
        className={cn('message group flex w-full scroll-mt-12 items-end justify-end gap-1', {
          'self-message self-end': message.senderId === userId,
          'companion-message flex-row-reverse': message.senderId !== userId,
        })}>
        {/* Message settings in dropdown menu */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild disabled={isBlockedChat}>
            <div
              onDoubleClick={message.senderId !== userId ? handleDoubleClick : undefined}
              ref={containerRef}
              className={cn(
                'message-container relative flex w-fit min-w-32 max-w-[65%] cursor-pointer flex-col gap-2 whitespace-pre-line break-words rounded-3xl border py-1 leading-6 md:max-w-[80%]',
                {
                  'border-primary-hover-light bg-primary-light dark:border-primary-hover-dark dark:bg-primary-dark':
                    message.senderId === userId,
                  'border-zinc-400': message.senderId !== userId,
                  'animate-new-message-pulse dark:animate-new-message-pulse-dark':
                    message.senderId !== userId && !message.isRead,
                  'bg-primary-hover-light dark:bg-primary-dark/40':
                    isEditing || isActiveSearchMessage,
                }
              )}>
              {children}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="message-settings"
            side={message.senderId === userId ? 'left' : 'right'}
            align="start">
            <MessageSettingsDropdownItems message={message} />
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    );
  }
);

export const MessageContainerMemo = memo(MessageContainer, (oldProps, newProps) => {
  // Comparing only the properties that are used in the component
  return Boolean(
    oldProps.isBlockedChat === newProps.isBlockedChat &&
      oldProps.message.senderId === newProps.message.senderId &&
      oldProps.message.isRead === newProps.message.isRead &&
      oldProps.isEditing === newProps.isEditing &&
      oldProps.message.id === newProps.message.id &&
      oldProps.message.isLiked === newProps.message.isLiked &&
      Number(oldProps.message.createdAt) === Number(newProps.message.createdAt) &&
      oldProps.isActiveSearchMessage === newProps.isActiveSearchMessage &&
      [...oldProps.unreadMessages].join('') === [...newProps.unreadMessages].join('')
  );
});

MessageContainer.displayName = 'MessageContainer';
