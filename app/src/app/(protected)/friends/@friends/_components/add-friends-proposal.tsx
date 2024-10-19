import Link from 'next/link';
import { ROUTES } from '~/constants/routes';

export const AddFriendsProposal = () => {
  return (
    <p className="text-xs">
      To add new friends see{' '}
      <Link href={ROUTES.allFriends} className="link">
        all users list
      </Link>{' '}
      or invite your friends
    </p>
  );
};
