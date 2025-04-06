import { generateChatDateKey } from '~/lib/utils';
import { type BaseHandlerArgs } from './types';

export const onRemoveMessageHandler = ({ utils, data }: BaseHandlerArgs<'onRemoveMessage'>) => {
  utils.chats.getByCompanionId.setData({ companionId: data.removedMessage.senderId }, (oldData) => {
    if (oldData) {
      const updatedMessagesMap = new Map(oldData.messagesMap);
      const dateKey = generateChatDateKey(data.removedMessage.createdAt);

      const messagesByDate = updatedMessagesMap.get(dateKey);

      if (messagesByDate) {
        const removingMessageIndex = messagesByDate?.findIndex(
          (m) => m.id === data.removedMessage.id
        );

        if (removingMessageIndex !== -1) {
          messagesByDate.splice(removingMessageIndex, 1);

          if (!messagesByDate.length) {
            updatedMessagesMap.delete(dateKey);
          } else {
            updatedMessagesMap.set(dateKey, messagesByDate);
          }

          return {
            ...oldData,
            messagesMap: updatedMessagesMap,
          };
        }
      }
    }

    return oldData;
  });
};
