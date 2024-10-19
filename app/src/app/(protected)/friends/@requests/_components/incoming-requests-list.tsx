import { type User } from 'next-auth';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { IncomingRequestActions } from './incoming-request-actions';

const incomingRequests: Pick<User, 'id' | 'name' | 'image'>[] = [
  {
    id: '1',
    name: 'Someone',
    image: undefined,
  },
  {
    id: '1',
    name: 'Someone',
    image: undefined,
  },
  {
    id: '1',
    name: 'Someone',
    image: undefined,
  },
  {
    id: '1',
    name: 'Someone',
    image: undefined,
  },
  {
    id: '1',
    name: 'Someone',
    image: undefined,
  },
];

export const IncomingRequestsList = () => {
  return (
    <UsersList>
      {incomingRequests.map((incomingRequest) => (
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
  );
};
