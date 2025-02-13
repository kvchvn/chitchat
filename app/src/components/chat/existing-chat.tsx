import { useEffect, useRef } from 'react';
import { Message } from '~/components/chat/message';
import { type ChatPretty } from '~/server/db/schema/chats';
import { type ChatMessage } from '~/server/db/schema/messages';
import { ChatForm } from './chat-form';

type Props = {
  chat: ChatPretty;
  messages: (ChatMessage | null)[];
};

// TODO: remove
const messages = [
  { text: 'Message 1', userId: '1' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 222 Message 222 Message 222', userId: '2' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 1 Message 1', userId: '1' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 222', userId: '2' },
  { text: 'Message 1', userId: '1' },
  { text: 'Message 222', userId: '2' },
];

export const ExistingChat = ({ chat, messages }: Props) => {
  const bottomOfListRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    bottomOfListRef.current?.scrollIntoView();
  }, []);

  return (
    <>
      {messages.length ? (
        <div className="mb-4 mt-2 w-[calc(100%+8px)] grow overflow-y-auto pr-[8px] scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px]">
          <ul className="flex min-h-full flex-col justify-end gap-2 overflow-y-auto">
            {messages.map((message, i) => (
              <Message
                key={i}
                text={message?.text ?? '[Broken message]'}
                fromCurrentUser={chat.userId === message?.senderId}
              />
            ))}
          </ul>
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
