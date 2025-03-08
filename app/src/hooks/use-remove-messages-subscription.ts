import { usePathname } from 'next/navigation';
import { api } from '~/trpc/react';

type Args = {
  userId: string;
};

export const useRemoveMessagesSubscription = ({ userId }: Args) => {
  const utils = api.useUtils();
  const pathname = usePathname();

  api.messages.onRemoveMessages.useSubscription(
    { userId },
    {
      onData: () => {
        utils.chats.getByCompanionId.setData({ companionId: pathname.slice(1) }, (staleChat) => {
          return staleChat
            ? {
                chat: staleChat.chat,
                messages: [],
              }
            : staleChat;
        });
      },
    }
  );
};
