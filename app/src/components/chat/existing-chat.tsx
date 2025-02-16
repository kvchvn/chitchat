import { useEffect, useRef } from 'react';
import { ChatForm } from '~/components/chat/chat-form';
import { MessageContainer } from '~/components/message/message-container';
import { MessageStatusBar } from '~/components/message/message-status-bar';
import { MessageStatusIcon } from '~/components/message/message-status-icon';
import { MessageTime } from '~/components/message/message-time';
import { type ChatPretty } from '~/server/db/schema/chats';
import { type ChatMessage } from '~/server/db/schema/messages';

type Props = {
  chat: ChatPretty;
  messages: (ChatMessage | null)[];
};

export const ExistingChat = ({ chat, messages }: Props) => {
  const bottomOfListRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    bottomOfListRef.current?.scrollIntoView();
  }, [messages.length]);

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
      <ChatForm chat={chat} />
    </>
  );
};
