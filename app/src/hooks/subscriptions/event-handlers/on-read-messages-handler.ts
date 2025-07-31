import { generateChatDateKey } from '~/lib/utils';
import { type BaseHandlerArgs } from './types';

export const onReadMessagesHandler = ({ utils, data }: BaseHandlerArgs<'onReadMessages'>) => {
  if (!data.readMessages.length) {
    return;
  }

  utils.chats.getByCompanionId.setData(
    { companionId: data.readMessages[0]!.receiverId },
    (oldData) => {
      if (oldData) {
        const updatedMessagesMap = new Map(oldData.messagesMap);

        data.readMessages.forEach((message) => {
          const dateKey = generateChatDateKey(message.createdAt);

          const messagesByDate = updatedMessagesMap.get(dateKey);

          if (messagesByDate) {
            const currentMessageIndex = messagesByDate.findIndex((m) => m.id === message.id);

            if (currentMessageIndex !== -1) {
              const currentMessage = messagesByDate[currentMessageIndex]!;
              const updatedMessage: typeof currentMessage = {
                ...currentMessage,
                isRead: message.isRead,
              };

              const updatedMessagesByDate = messagesByDate
                .slice(0, currentMessageIndex)
                .concat(updatedMessage, messagesByDate.slice(currentMessageIndex + 1));

              updatedMessagesMap.set(dateKey, updatedMessagesByDate);
            }
          }
        });

        return {
          ...oldData,
          messagesMap: updatedMessagesMap,
        };
      }

      return oldData;
    }
  );
};
