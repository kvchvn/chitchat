'use client';

import { MessageSquarePlus } from 'lucide-react';
import { ChatContainer } from '~/components/chat/chat-container';
import { Button } from '~/components/ui/button';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { LoadingIcon } from '../ui/loading-icon';

type Props = {
  userId: string;
  companionId: string;
  companionName: string;
};

export const ChatIsNotCreated = ({ userId, companionId, companionName }: Props) => {
  const { toast } = useToast();
  const { mutateAsync: createNewChat, isPending } = api.chats.create.useMutation();
  const utils = api.useUtils();

  const handleClick = async () => {
    await createNewChat({ userId: userId, companionId })
      .then(async () => {
        toast({
          variant: 'default',
          title: 'Chat is created',
          description: `Now you can communicate with ${companionName}`,
        });
        await utils.chats.getByMembersIds.invalidate({ userId, companionId });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Chat is not created',
          description: 'Something went wrong. Try to repeat it later',
        });
      });
  };

  return (
    <ChatContainer>
      <div className="max-w-100 flex flex-col items-center gap-2 text-center">
        <h3>Chat is not created yet.</h3>
        <p>But you can do it easily. Just click the button below.</p>
        <Button onClick={handleClick} disabled={isPending} className="mt-4">
          {!isPending ? <MessageSquarePlus /> : <LoadingIcon />}
          Start chatting
        </Button>
      </div>
    </ChatContainer>
  );
};
