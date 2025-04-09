import { EllipsisVertical } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useCompanionId } from '~/hooks/use-companion-id';
import { cn } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';
import { useUserId } from '../contexts/user-id-provider';
import { EditMessageDropdownItem } from './edit-message-dropdown-item';
import { LikeMessageDropdownItem } from './like-message-dropdown-item';
import { RemoveMessageDropdownItem } from './remove-message-dropdown-item';

type Props = {
  message: ChatMessage;
};

export const MessageSettings = ({ message }: Props) => {
  const userId = useUserId();
  const companionId = useCompanionId();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-xs"
          variant="ghost"
          className={cn('invisible absolute bottom-0 group-hover:visible', {
            'right-[calc(100%+8px)]': userId === message.senderId,
            'left-[calc(100%+8px)]': companionId === message.senderId,
          })}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align={userId === message.senderId ? 'end' : 'start'}>
        {message.senderId === userId ? (
          <>
            <EditMessageDropdownItem message={message} />
            <RemoveMessageDropdownItem message={message} />
          </>
        ) : null}
        {message.senderId !== userId ? <LikeMessageDropdownItem message={message} /> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
