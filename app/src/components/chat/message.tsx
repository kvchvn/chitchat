import { cn } from '~/lib/utils';

type Props = {
  text: string;
  userId: string;
};

export const Message = ({ text, userId }: Props) => {
  return (
    <li
      className={cn(
        userId === '2' && 'self-message self-end',
        'w-fit max-w-[45%] rounded-3xl border px-6 py-1'
      )}>
      {text}
    </li>
  );
};
