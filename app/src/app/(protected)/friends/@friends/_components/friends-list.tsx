import { type User } from 'next-auth';
import { NoUsersContainer } from '~/app/(protected)/_components/no-users-container';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersContainer } from '~/app/(protected)/_components/users-container';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { UsersPagination } from '~/app/(protected)/_components/users-pagination';
import { getUsersSlice } from '~/lib/utils';
import { AddFriendsProposal } from './add-friends-proposal';
import { FriendAction } from './friend-action';
import { FriendsSearch } from './friends-search';

const friends: Pick<User, 'id' | 'name' | 'image'>[] = [
  // {
  //   id: '1',
  //   name: 'Name Surname 1',
  //   image: undefined,
  // },
  // {
  //   id: '2',
  //   name: 'Name Surname 2',
  //   image: undefined,
  // },
  // {
  //   id: '3',
  //   name: 'Name Surname 3',
  //   image: undefined,
  // },
  // {
  //   id: '4',
  //   name: 'Name Surname 4',
  //   image: undefined,
  // },
  // {
  //   id: '5',
  //   name: 'Name Surname 5',
  //   image: undefined,
  // },
  // {
  //   id: '6',
  //   name: 'Name Surname 6',
  //   image: undefined,
  // },
];

const FRIENDS_LIMIT = 5;
// temporary
const PAGE = 1;

export const FriendsList = () => {
  if (!friends.length) {
    return (
      <NoUsersContainer>
        <p>You don&apos;t have friends here.</p>
        <AddFriendsProposal />
      </NoUsersContainer>
    );
  }

  const moreThanLimit = friends.length > FRIENDS_LIMIT;
  const friendsSlice = getUsersSlice({ users: friends, page: PAGE, perPage: FRIENDS_LIMIT - 1 });

  /**
   * 1) friends = 0 -> show placeholder
   * 2) friends <= 5 -> show all of them
   * 3) friends > 5 -> show 4 + pagination (to avoid layout shift, the height is equal to UserItem's height)
   */

  return (
    <>
      <FriendsSearch />
      <UsersContainer>
        <UsersList>
          {/* TODO: make slices on the backend */}
          {friendsSlice.map((friend) => (
            <UserItem key={friend.id} id={friend.id} image={friend.image} name={friend.name}>
              <FriendAction id={friend.id} />
            </UserItem>
          ))}
        </UsersList>
        {friends.length < FRIENDS_LIMIT && (
          <div className="mt-auto self-center pt-6">
            <AddFriendsProposal />
          </div>
        )}
        {moreThanLimit && <UsersPagination />}
      </UsersContainer>
    </>
  );
};
