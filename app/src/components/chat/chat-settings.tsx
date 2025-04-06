'use client';

import { EllipsisVertical } from 'lucide-react';

import { BlockUserDropdownItem } from '~/components/chat/block-user-dropdown-item';
import { ClearMessagesDropdownItem } from '~/components/chat/clear-messages-dropdown-item';
import { ChatIdProvider } from '~/components/contexts/chat-id-provider';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useCompanionId } from '~/hooks/use-companion-id';
import { api } from '~/trpc/react';

export const ChatSettings = () => {
  const companionId = useCompanionId();
  const { data: chat } = api.chats.getByCompanionId.useQuery({ companionId }, { enabled: false });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="outline" className="ml-auto">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      {chat ? (
        <ChatIdProvider chatId={chat.chat.id}>
          <DropdownMenuContent align="end">
            {/* Clear messages */}
            <ClearMessagesDropdownItem disabled={!chat.messagesMap.size} />
            {/* Block user */}
            {chat.chat.blockedBy === companionId ? null : (
              <BlockUserDropdownItem block={!chat.chat.blockedBy} />
            )}
          </DropdownMenuContent>
        </ChatIdProvider>
      ) : null}
    </DropdownMenu>
  );
};
