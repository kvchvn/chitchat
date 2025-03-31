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
import { useClearMessagesOptimisticMutation } from '~/hooks/mutations/use-clear-messages-optimistic-mutation';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useChatId } from '../contexts/chat-id-provider';

type Props = {
  disabled?: boolean;
};

export const ClearMessagesDropdownItem = ({ disabled }: Props = { disabled: false }) => {
  const companionId = useCompanionId();
  const chatId = useChatId();

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { mutate: clearMessages } = useClearMessagesOptimisticMutation();

  const handleClick = () => {
    clearMessages({ chatId, companionId });
  };

  return (
    <AlertDialog>
      <DropdownMenuItem
        disabled={disabled}
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
