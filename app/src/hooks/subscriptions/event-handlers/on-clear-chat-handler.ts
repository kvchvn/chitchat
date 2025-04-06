import { type BaseHandlerArgs } from './types';

export const onClearChatHandler = ({ utils, data }: BaseHandlerArgs<'onClearChat'>) => {
  utils.chats.getByCompanionId.setData({ companionId: data.clearedById }, (staleChat) => {
    return staleChat
      ? {
          chat: staleChat.chat,
          messagesMap: new Map(),
        }
      : staleChat;
  });
};
