import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { useUserId } from '~/components/contexts/user-id-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { DropdownMenuItem } from '~/components/ui/dropdown-menu';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { useChatId } from '../contexts/chat-id-provider';

export const ClearMessagesDropdownItem = () => {
  const userId = useUserId();
  const companionId = useCompanionId();
  const chatId = useChatId();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: removeMessages } = api.messages.removeAllFromChat.useMutation({
    onMutate: async () => {
      await utils.chats.getByCompanionId.cancel();

      const previousChat = utils.chats.getByCompanionId.getData();

      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) =>
        staleChat
          ? {
              chat: staleChat.chat,
              messages: [],
            }
          : staleChat
      );

      return { previousChat };
    },
    onError: (_, __, context) => {
      utils.chats.getByCompanionId.setData({ companionId }, context?.previousChat);

      toast({
        variant: 'destructive',
        title: 'Messages removing failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: async () => {
      await utils.chats.getByCompanionId.invalidate({ companionId });
    },
  });

  const handleClick = () => {
    removeMessages({ chatId, userId, companionId });
  };

  return (
    <AlertDialog>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          triggerRef.current?.click();
        }}>
        <Trash2 />
        Clear messages
        <AlertDialogTrigger ref={triggerRef} />
      </DropdownMenuItem>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all messages in the chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline" className="min-w-24">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button size="sm" variant="destructive" className="min-w-24" onClick={handleClick}>
              Clear
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
