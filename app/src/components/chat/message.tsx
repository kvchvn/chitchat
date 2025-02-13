import { cn } from '~/lib/utils';

type Props = {
  text: string;
  fromCurrentUser: boolean;
};

export const Message = ({ text, fromCurrentUser }: Props) => {
  return (
    <li
      className={cn(
        fromCurrentUser && 'self-message self-end bg-zinc-200',
        'w-fit max-w-[80%] break-words rounded-3xl border border-zinc-300 px-6 py-1 leading-6'
      )}>
      {text}
    </li>
  );
};
