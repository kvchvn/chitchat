import { cn } from '~/lib/utils';

/**
 * scope - filename from /public/svg (e.g. 'auth' means that you refer to auth.svg)
 * id - symbol's id
 */
type Props = {
  scope: 'auth' | 'global';
  id: string;
  className?: string;
};

export const Icon = ({ id, scope, className }: Props) => {
  return (
    <svg className={cn('h-4 w-4 shrink-0 fill-current', className)}>
      <use xlinkHref={`/svg/${scope}.svg#${id}`} />
    </svg>
  );
};
