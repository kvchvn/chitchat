import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
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
import { useRemoveMessageOptimisticMutation } from '~/hooks/mutations/use-remove-message-optimistic-mutation';
import { useCompanionId } from '~/hooks/use-companion-id';
import { generateChatDateKey } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';
import { useChatId } from '../contexts/chat-id-provider';

type Props = {
  message: ChatMessage;
};

export const RemoveMessageDropdownItem = ({ message }: Props) => {
  const companionId = useCompanionId();
  const chatId = useChatId();

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { mutate: removeMessage } = useRemoveMessageOptimisticMutation();

  const handleClick = () => {
    const dateKey = generateChatDateKey(message.createdAt);
    removeMessage({ id: message.id, dateKey, receiverId: companionId, chatId });
  };

  return (
    <AlertDialog>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          triggerRef.current?.click();
        }}>
        <Trash2 />
        Remove
        <AlertDialogTrigger ref={triggerRef} />
      </DropdownMenuItem>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message.
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
              Remove
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
