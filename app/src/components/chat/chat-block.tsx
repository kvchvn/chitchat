import { TriangleAlert } from 'lucide-react';

type Props = {
  byCurrentUser: boolean;
};

export const ChatBlock = ({ byCurrentUser }: Props) => {
  return (
    <div className="flex w-full gap-2 rounded-md bg-error-light/10 p-4 text-error-active-light dark:bg-error-dark/20 dark:text-error-active-dark">
      <TriangleAlert className="shrink-0" />
      <p className="text-balance">
        {byCurrentUser
          ? "You've blocked the user. To send a message you must unblock him/her at first."
          : 'You are blocked by the user and cannot send any messages.'}
      </p>
    </div>
  );
};
