import { Heart, PencilLine } from 'lucide-react';
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ChatBlock } from '~/components/chat/chat-block';
import { ChatForm } from '~/components/chat/chat-form';
import { EditMessagePreview } from '~/components/chat/edit-message-preview';
import { useUserId } from '~/components/contexts/user-id-provider';
import { MessageContainerMemo } from '~/components/message/message-container';
import { MessageStatusBar } from '~/components/message/message-status-bar';
import { MessageStatusIcon } from '~/components/message/message-status-icon';
import { MessageTime } from '~/components/message/message-time';
import { useReadNewMessagesOptimisticMutation } from '~/hooks/mutations/use-read-new-messages-optimistic-mutation';
import { useCompanionId } from '~/hooks/use-companion-id';
import { type ChatMessage } from '~/server/db/schema/messages';
import { useStore } from '~/store/store';
import { MessageTextMemo } from '../message/message-text';

type Props = {
  messagesMap: Map<string, ChatMessage[]>;
  blockedBy: string | null;
};

export const ExistingChat = ({ messagesMap, blockedBy }: Props) => {
  const messagesEntries = Array.from(messagesMap);
  const todayMessages = messagesEntries.at(-1)?.[1];
  const latestTodayMessage = todayMessages?.at(-1);

  const messageToEdit = useStore.use.messageToEdit();
  const activeSearchMessageId = useStore.use.activeSearchMessageId();
  const searchQuery = useStore.use.searchQuery();

  const userId = useUserId();
  const companionId = useCompanionId();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstUnreadMessageRef = useRef<HTMLLIElement | null>(null);
  const unreadMessages = useRef<Set<string>>(new Set([]));
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: readUnreadMessages } = useReadNewMessagesOptimisticMutation();

  const onReadMessages = useCallback(() => {
    if (unreadMessages.current.size) {
      readUnreadMessages({
        senderId: companionId,
        receiverId: userId,
        messagesIds: Array.from(unreadMessages.current),
      });
    }
  }, [userId, companionId, readUnreadMessages]);

  const handleScroll = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      onReadMessages();
      unreadMessages.current.clear();
    }, 1000);
  };

  const onSendMessageSideEffect = useCallback(() => {
    firstUnreadMessageRef.current = null;
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const containerOffset =
      containerRef.current.scrollHeight -
      (containerRef.current.scrollTop + containerRef.current.clientHeight);

    // scroll to the bottom when send a message
    // the latest (by date) array of messages. And the latest message in there
    if (latestTodayMessage?.senderId === userId || containerOffset < 200) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [latestTodayMessage?.id, userId, latestTodayMessage?.senderId]);

  useLayoutEffect(() => {
    // initial scroll to the freshest unread message or to the bottom of the chat
    const container = containerRef.current;
    const message = firstUnreadMessageRef.current;

    if (container) {
      if (message) {
        container.scrollTo({ top: message.offsetTop - message.offsetHeight - 100 });
      } else {
        container.scrollTo({ top: container.scrollHeight });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // such way I get the freshest unreadMessages ref
    const timerId = setTimeout(() => {
      onReadMessages();
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [onReadMessages, todayMessages?.length]);

  return (
    <>
      {messagesMap.size ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="focus-ring-default scrollbar-stable messages-list-container relative my-2 w-[calc(100%+8px)] max-w-full grow overflow-y-auto overflow-x-hidden pr-0 scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px] md:pr-[8px]">
          <div className="flex min-h-full w-full flex-col justify-end pt-10">
            {messagesEntries.map(([date, messages]) => (
              <Fragment key={date}>
                <span className="messages-list-date mx-auto block w-fit rounded-3xl bg-accent-light px-3 py-1 font-mono text-xs dark:bg-accent-dark">
                  {date}
                </span>
                <ul className="flex shrink-0 flex-col justify-end gap-2 overflow-y-auto overflow-x-hidden px-1 py-8">
                  {messages.map((message) => (
                    <MessageContainerMemo
                      key={`${message.id}-${message.text}`}
                      isBlockedChat={Boolean(blockedBy)}
                      message={message}
                      isEditing={message.id === messageToEdit?.id}
                      unreadMessages={unreadMessages.current}
                      isActiveSearchMessage={activeSearchMessageId === message.id}
                      ref={firstUnreadMessageRef}>
                      <MessageTextMemo
                        text={message.text}
                        searchQuery={searchQuery}
                        isActiveSearchMessage={activeSearchMessageId === message.id}
                      />
                      <MessageStatusBar fromCurrentUser={userId === message.senderId}>
                        <MessageTime createdAt={message.createdAt} />
                        {message.isLiked ? <Heart className="h-3 w-3" fill="currentColor" /> : null}
                        {Number(message.createdAt) !== Number(message.updatedAt) ? (
                          <PencilLine className="h-3 w-3" />
                        ) : null}
                        {userId === message.senderId ? (
                          <MessageStatusIcon isRead={message.isRead} isSent={message.isSent} />
                        ) : null}
                      </MessageStatusBar>
                    </MessageContainerMemo>
                  ))}
                </ul>
              </Fragment>
            ))}
            {!blockedBy ? <EditMessagePreview /> : null}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-gray-dark dark:text-gray-light">There are no messages yet...</span>
        </div>
      )}
      {blockedBy ? (
        <ChatBlock byCurrentUser={blockedBy === userId} />
      ) : (
        <ChatForm onFormSubmitSideEffect={onSendMessageSideEffect} />
      )}
    </>
  );
};
