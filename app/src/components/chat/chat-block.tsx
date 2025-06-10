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
          ? "You've blocked the user. To send a message you should unblock him at first."
          : 'You have been blocked by the user and cannot send any message.'}
      </p>
    </div>
  );
};
