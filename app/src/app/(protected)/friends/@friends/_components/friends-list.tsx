import { type User } from 'next-auth';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { EmptyBox } from '~/components/ui/empty-box';
import { AddFriendsProposal } from './add-friends-proposal';
import { FriendAction } from './friend-action';
import { FriendsSearch } from './friends-search';

const friends: Pick<User, 'id' | 'name' | 'image'>[] = [
  {
    id: '1',
    name: 'Name Surname',
    image: undefined,
  },
];

const MIN_FRIENDS = 5;

export const FriendsList = () => {
  if (!friends.length) {
    return (
      <div className="my-auto flex flex-col gap-2 self-center text-center text-xs text-slate-500 dark:text-slate-400">
        <EmptyBox size="lg" className="opacity-50" />
        <p>You don&apos;t have friends here.</p>
        <AddFriendsProposal />
      </div>
    );
  }

  return (
    <>
      <FriendsSearch />
      <div className="flex flex-col gap-4 self-stretch">
        <UsersList>
          {friends.map((friend) => (
            <UserItem key={friend.id} id={friend.id} image={friend.image} name={friend.name}>
              <FriendAction id={friend.id} />
            </UserItem>
          ))}
        </UsersList>
        {friends.length < MIN_FRIENDS && (
          <div className="mt-6 self-center">
            <AddFriendsProposal />
          </div>
        )}
      </div>
    </>
  );
};
