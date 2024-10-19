import { type User } from 'next-auth';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { OutcomingRequestAction } from './outcoming-request-action';

const outcomingRequests: Pick<User, 'id' | 'name' | 'image'>[] = [
  {
    id: '1',
    name: 'Good Man',
    image: undefined,
  },
];

export const OutcomingRequestsList = () => {
  return (
    <UsersList>
      {outcomingRequests.map((outcomingRequest) => (
        <UserItem
          key={outcomingRequest.id}
          id={outcomingRequest.id}
          name={outcomingRequest.name}
          image={outcomingRequest.image}
        >
          <OutcomingRequestAction id={outcomingRequest.id} />
        </UserItem>
      ))}
    </UsersList>
  );
};
