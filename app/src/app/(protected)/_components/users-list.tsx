import React from 'react';
import { cn } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  className?: string;
};

export const UsersList = ({ children, className }: Props) => {
  return <ul className={cn('flex flex-col gap-3', className)}>{children}</ul>;
};
