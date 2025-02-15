import { Message } from '~/components/chat/message';
import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';

type Props = {
  messages: (ChatMessage | null)[];
  userId: string;
  companionId: string;
};

export const MessagesList = ({ messages, userId }: Props) => {
  const utils = api.useUtils();

  api.messages.onCreateMessage.useSubscription(undefined, {
    onData: (newMessage) => {
      utils.chats.getByMembersIds.setData(
        { userId: newMessage.receiverId, companionId: newMessage.senderId },
        (oldData) =>
          oldData
            ? {
                chat: oldData.chat,
                messages: [...oldData.messages, newMessage],
              }
            : oldData
      );
    },
    onError: (err) => {
      console.log('err', err);
    },
  });

  return (
    <ul className="flex min-h-full flex-col justify-end gap-2 overflow-y-auto">
      {messages.map((message) => (
        <Message
          key={message?.id}
          text={message?.text ?? '[Broken message]'}
          fromCurrentUser={userId === message?.senderId}
        />
      ))}
    </ul>
  );
};
