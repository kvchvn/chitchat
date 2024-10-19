import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { Icon } from './icon';

const emptyBoxVariants = cva('mx-auto', {
  variants: {
    size: {
      xs: 'w-8 h-8',
      sm: 'w-16 h-16',
      md: 'w-24 h-24',
      lg: 'w-36 h-36',
    },
    defaultVariants: {
      size: 'md',
    },
  },
});

type Props = VariantProps<typeof emptyBoxVariants> & {
  className?: string;
};

export const EmptyBox = ({ size, className }: Props) => {
  return (
    <div className={cn(emptyBoxVariants({ size }), className)}>
      <Icon scope="global" id="empty-box" className="h-full w-full" />
    </div>
  );
};
