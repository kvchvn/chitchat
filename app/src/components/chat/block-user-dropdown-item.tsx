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
import { useBlockUserOptimisticMutation } from '~/hooks/mutations/use-block-user-optimistic-mutation';
import { useCompanionId } from '~/hooks/use-companion-id';
import { cn } from '~/lib/utils';

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

  const { mutate: toggleBlock } = useBlockUserOptimisticMutation();

  const handleClick = () => {
    toggleBlock({ chatId, blockedUserId: companionId, block });
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
