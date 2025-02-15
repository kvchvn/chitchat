import { cn } from '~/lib/utils';

type Props = {
  text: string;
  fromCurrentUser: boolean;
};

export const Message = ({ text, fromCurrentUser }: Props) => {
  return (
    <li
      className={cn(
        'w-fit max-w-[80%] break-words rounded-3xl border px-6 py-1 leading-6',
        fromCurrentUser &&
          'self-message self-end border-primary-hover-light bg-primary-light dark:border-primary-hover-dark dark:bg-primary-dark',
        !fromCurrentUser && 'companion-message border-zinc-400'
      )}>
      {text}
    </li>
  );
};
