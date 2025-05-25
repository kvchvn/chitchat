import React from 'react';
import { cn } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  className?: string;
};

export const Wrapper = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1280px] px-4 xs:px-6 md:px-12 xl:max-w-[1440px] xl:px-16',
        className
      )}>
      {children}
    </div>
  );
};
