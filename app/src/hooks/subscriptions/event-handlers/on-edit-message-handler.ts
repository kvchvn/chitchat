import { generateChatDateKey } from '~/lib/utils';
import { type BaseHandlerArgs } from './types';

export const onEditMessageHandler = ({ utils, data }: BaseHandlerArgs<'onEditMessage'>) => {
  utils.chats.getByCompanionId.setData({ companionId: data.updatedMessage.senderId }, (oldData) => {
    if (oldData) {
      const updatedMessagesMap = new Map(oldData.messagesMap);
      const dateKey = generateChatDateKey(data.updatedMessage.createdAt);

      const messagesByDate = updatedMessagesMap.get(dateKey);
      const currentMessage = messagesByDate?.find((m) => m.id === data.updatedMessage.id);

      if (currentMessage) {
        currentMessage.text = data.updatedMessage.text;
        currentMessage.updatedAt = data.updatedMessage.updatedAt;

        return {
          ...oldData,
          messagesMap: updatedMessagesMap,
        };
      }
    }

    return oldData;
  });
};
