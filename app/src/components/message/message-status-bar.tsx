import React from 'react';
import { cn } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  fromCurrentUser: boolean;
};

export const MessageStatusBar = ({ fromCurrentUser, children }: Props) => {
  return (
    <div
      className={cn(
        'ml-2 flex justify-end gap-1 px-2 text-sm text-zinc-500 dark:text-zinc-400',
        !fromCurrentUser && 'flex-row-reverse justify-start pr-3'
      )}>
      {children}
    </div>
  );
};
