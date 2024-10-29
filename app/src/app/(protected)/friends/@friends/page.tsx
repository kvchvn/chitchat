import Link from 'next/link';
import { ROUTES } from '~/constants/routes';
import { FriendsList } from './_components/friends-list';

export default function Friends() {
  return (
    <section className="flex h-[434px] flex-col items-start gap-6 rounded-xl border border-slate-200 p-4">
      <Link href={ROUTES.allFriends} className="link-ghost">
        <h2 className="font-title">Friends</h2>
      </Link>
      <FriendsList />
    </section>
  );
}
