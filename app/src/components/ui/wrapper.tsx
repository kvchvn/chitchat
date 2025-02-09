import React from 'react';
import { cn } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  className?: string;
};

export const Wrapper = ({ children, className }: Props) => {
  return (
    <div className={cn('mx-auto w-full max-w-[1280px] px-12 xl:max-w-[1440px]', className)}>
      {children}
    </div>
  );
};
