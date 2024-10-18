'use client';

import { cva } from 'class-variance-authority';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { cn } from '~/lib/utils';

const iconVariants = cva('absolute transition-transform duration-500 scale-30', {
  variants: {
    type: {
      sun: 'translate-x-[200%]',
      moon: '-translate-x-[200%]',
    },
    isOn: {
      true: 'translate-x-0 scale-100',
    },
  },
});

type Props = {
  className?: string;
};

export const ThemeToggler = ({ className }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return <Button size="icon" className={cn('', className)}></Button>;
  }

  return (
    <Button size="icon" onClick={handleClick} className={cn('relative overflow-hidden', className)}>
      <Icon
        scope="global"
        id="sun"
        className={cn(iconVariants({ type: 'sun', isOn: theme === 'light' }))}
      />
      <Icon
        scope="global"
        id="moon"
        className={cn(iconVariants({ type: 'moon', isOn: theme === 'dark' }))}
      />
    </Button>
  );
};
