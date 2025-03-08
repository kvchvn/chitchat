import { useCallback, useEffect, useRef } from 'react';
import { ChatForm } from '~/components/chat/chat-form';
import { MessageContainer } from '~/components/message/message-container';
import { MessageStatusBar } from '~/components/message/message-status-bar';
import { MessageStatusIcon } from '~/components/message/message-status-icon';
import { MessageTime } from '~/components/message/message-time';
import { useNewMessagesSubscription } from '~/hooks/use-new-messages-subscription';
import { useNewReadMessagesSubscription } from '~/hooks/use-new-read-messages-subscription';
import { type ChatPretty } from '~/server/db/schema/chats';
import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';

type Props = {
  chat: ChatPretty;
  messages: (ChatMessage | null)[];
};

export const ExistingChat = ({ chat, messages }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstUnreadMessageRef = useRef<HTMLLIElement | null>(null);
  const unreadMessages = useRef<Set<string>>(new Set([]));
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: readUnreadMessages } = api.messages.readUnreadMessages.useMutation();

  useNewMessagesSubscription();
  useNewReadMessagesSubscription({ companionId: chat.companionId });

  const onReadMessages = useCallback(() => {
    if (unreadMessages.current.size) {
      readUnreadMessages({
        senderId: chat.companionId,
        receiverId: chat.userId,
        messagesIds: Array.from(unreadMessages.current),
      });
    }
  }, [chat.userId, chat.companionId, readUnreadMessages]);

  const handleScroll = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      onReadMessages();
      unreadMessages.current.clear();
    }, 1000);
  };

  const onSendMessageSideEffect = () => {
    firstUnreadMessageRef.current = null;
  };


  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const containerOffset =
      containerRef.current.scrollHeight -
      (containerRef.current.scrollTop + containerRef.current.clientHeight);

    // scroll to the bottom when send a message
    if (messages.at(-1)?.senderId === chat.userId || containerOffset < 200) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, chat.userId]);

  useEffect(() => {
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
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [onReadMessages, messages.length]);

  return (
    <>
      {messages.length ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative mb-4 mt-2 w-[calc(100%+8px)] grow overflow-y-auto pr-[8px] scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px]">
          <ul className="flex min-h-full flex-col justify-end gap-2 overflow-y-auto px-1 pb-1 pt-4">
            {messages.map((message) =>
              message ? (
                <MessageContainer
                  key={message.id}
                  messageId={message.id}
                  fromCurrentUser={chat.userId === message.senderId}
                  isRead={message.isRead}
                  unreadMessages={unreadMessages.current}
                  ref={firstUnreadMessageRef}>
                  <span className="px-5">{message.text}</span>
                  <MessageStatusBar fromCurrentUser={chat.userId === message.senderId}>
                    <MessageTime createdAt={message.createdAt} />
                    {chat.userId === message.senderId ? (
                      <MessageStatusIcon isRead={message.isRead} isSent={message.isSent} />
                    ) : null}
                  </MessageStatusBar>
                </MessageContainer>
              ) : null
            )}
          </ul>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-gray-dark dark:text-gray-light">There are no messages yet...</span>
        </div>
      )}
      <ChatForm chat={chat} onSubmitSideEffect={onSendMessageSideEffect} />
    </>
  );
};
