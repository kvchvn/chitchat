import { useEffect, useRef } from 'react';
import { ChatForm } from '~/components/chat/chat-form';
import { MessagesList } from '~/components/chat/messages-list';
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
        <div className="mb-4 mt-2 w-[calc(100%+8px)] grow overflow-y-auto pr-[8px] scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px]">
          <MessagesList messages={messages} userId={chat.userId} companionId={chat.companionId} />
          <span ref={bottomOfListRef} />
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
