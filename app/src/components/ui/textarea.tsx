import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import { cn } from '~/lib/utils';

type Props = TextareaAutosizeProps;

export const Textarea = ({ className, ...props }: Props) => {
  return (
    <TextareaAutosize className={cn('focus-ring-default rounded-md p-1', className)} {...props} />
  );
};
