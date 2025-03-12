import { Ban, Handshake } from 'lucide-react';
import { useRef } from 'react';
import { useChatId } from '~/components/contexts/chat-id-provider';
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
import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';

type Props = {
  block: boolean;
};

const BlockUserAlertDialogDescription = ({ block }: Pick<Props, 'block'>) => {
  return block
    ? 'This action will block this user for you. If you want to cancel this you may do it later.'
    : 'This action will unblock this user. You will be able to communicate with him/her again.';
};

export const BlockUserDropdownItem = ({ block }: Props) => {
  const userId = useUserId();
  const companionId = useCompanionId();
  const chatId = useChatId();

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: toggleBlock } = api.chats.toggleBlocking.useMutation({
    onMutate: async () => {
      await utils.chats.getByCompanionId.cancel();

      const previousChat = utils.chats.getByCompanionId.getData();

      utils.chats.getByCompanionId.setData({ companionId }, (staleChat) =>
        staleChat
          ? {
              chat: { ...staleChat.chat, blockedBy: userId },
              messages: staleChat.messages,
            }
          : staleChat
      );

      return { previousChat };
    },
    onError: (_, __, context) => {
      utils.chats.getByCompanionId.setData({ companionId }, context?.previousChat);

      toast({
        variant: 'destructive',
        title: 'User block failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: async () => {
      await utils.chats.getByCompanionId.invalidate({ companionId });
    },
  });

  const handleClick = () => {
    void toggleBlock({ chatId, blockedUserId: companionId, block });
  };

  if (userId === companionId) {
    // Cannot block yourself
    return null;
  }

  return (
    <AlertDialog>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          triggerRef.current?.click();
        }}
        className={cn(
          block &&
            'text-error-light hover:text-error-light focus:text-error-light dark:text-error-dark dark:hover:text-error-dark dark:focus:text-error-dark',
          !block &&
            'text-success-light hover:text-success-hover-light focus:text-success-light dark:text-success-dark dark:hover:text-success-hover-dark dark:focus:text-success-dark'
        )}>
        {block ? (
          <>
            <Ban />
            Block user
          </>
        ) : (
          <>
            <Handshake />
            Unblock user
          </>
        )}
        <AlertDialogTrigger ref={triggerRef} />
      </DropdownMenuItem>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <BlockUserAlertDialogDescription block={block} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline" className="min-w-24">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              size="sm"
              variant={block ? 'destructive' : 'default'}
              className="min-w-24"
              onClick={handleClick}>
              {block ? 'Block' : 'Unblock'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
