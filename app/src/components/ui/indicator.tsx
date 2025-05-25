import { cn } from '~/lib/utils';

type Props = {
  count: number | undefined | null;
  className?: string;
};

export const Indicator = ({ count, className }: Props) => {
  if (!count) {
    return null;
  }

  return (
    <span
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded-full border border-current bg-highlight-light font-mono text-xs leading-[1ex] dark:bg-highlight-dark',
        className
      )}>
      {count > 9 ? '9+' : count}
    </span>
  );
};
