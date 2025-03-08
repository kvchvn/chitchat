'use client';

import { Ban, EllipsisVertical } from 'lucide-react';

import { ClearMessagesDropdownItem } from '~/components/chat/clear-messages-dropdown-item';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export const ChatSettings = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="outline" className="ml-auto">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Clear messages */}
        <ClearMessagesDropdownItem />
        {/* Block user */}
        <DropdownMenuItem className="text-error-light hover:text-error-light focus:text-error-light dark:text-error-dark dark:hover:text-error-dark dark:focus:text-error-dark">
          <Ban />
          Block user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
