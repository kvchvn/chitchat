import { LoaderCircle, type LucideProps } from 'lucide-react';
import { cn } from '~/lib/utils';

type Props = LucideProps;

export const LoadingIcon = (props: Props) => {
  return <LoaderCircle {...props} className={cn('animate-spin', props.className)} />;
};
