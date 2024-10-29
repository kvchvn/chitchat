import React from 'react';
import { EmptyBox } from '~/components/ui/empty-box';

export const NoUsersContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="my-auto flex h-full flex-col justify-center gap-2 self-center text-center text-xs text-slate-500 dark:text-slate-400">
      <EmptyBox size="lg" className="opacity-50" />
      {children}
    </div>
  );
};
