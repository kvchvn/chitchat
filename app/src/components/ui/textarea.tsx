import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import { cn } from '~/lib/utils';

type Props = TextareaAutosizeProps;

export const Textarea = ({ className, ...props }: Props) => {
  return (
    <TextareaAutosize
      className={cn(
        'rounded-md p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-light focus-visible:ring-offset-1 dark:focus-visible:ring-slate-400',
        className
      )}
      {...props}
    />
  );
};
