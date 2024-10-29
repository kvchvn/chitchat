import { type User } from 'next-auth';
import { NoUsersContainer } from '~/app/(protected)/_components/no-users-container';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersContainer } from '~/app/(protected)/_components/users-container';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { UsersPagination } from '~/app/(protected)/_components/users-pagination';
import { getUsersSlice } from '~/lib/utils';
import { IncomingRequestActions } from './incoming-request-actions';

const incomingRequests: Pick<User, 'id' | 'name' | 'image'>[] = [
  // {
  //   id: '1',
  //   name: 'Someone 1',
  //   image: undefined,
  // },
  // {
  //   id: '2',
  //   name: 'Someone 2',
  //   image: undefined,
  // },
  // {
  //   id: '3',
  //   name: 'Someone 3',
  //   image: undefined,
  // },
  // {
  //   id: '4',
  //   name: 'Someone 4',
  //   image: undefined,
  // },
  // {
  //   id: '5',
  //   name: 'Someone 5',
  //   image: undefined,
  // },
  // {
  //   id: '6',
  //   name: 'Someone 6',
  //   image: undefined,
  // },
];

const REQUESTS_LIMIT = 5;
// temporary
const PAGE = 1;

export const IncomingRequestsList = () => {
  if (!incomingRequests.length) {
    return (
      <NoUsersContainer>
        <p>You don&apos;t have incoming friend requests.</p>
        <p>Propose someone to be your friend and have your common chat.</p>
      </NoUsersContainer>
    );
  }

  const moreThanLimit = incomingRequests.length > REQUESTS_LIMIT;
  const incomingRequestsSlice = getUsersSlice({
    users: incomingRequests,
    page: PAGE,
    perPage: REQUESTS_LIMIT - 1,
  });

  return (
    <UsersContainer>
      <UsersList>
        {incomingRequestsSlice.map((incomingRequest) => (
          <UserItem
            key={incomingRequest.id}
            id={incomingRequest.id}
            name={incomingRequest.name}
            image={incomingRequest.image}
          >
            <IncomingRequestActions id={incomingRequest.id} />
          </UserItem>
        ))}
      </UsersList>
      {moreThanLimit && <UsersPagination />}
    </UsersContainer>
  );
};
