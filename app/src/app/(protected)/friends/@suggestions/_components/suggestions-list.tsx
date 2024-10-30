import { type User } from 'next-auth';
import { NoUsersContainer } from '~/app/(protected)/_components/no-users-container';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersContainer } from '~/app/(protected)/_components/users-container';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { UsersPagination } from '~/app/(protected)/_components/users-pagination';
import { getUsersSlice } from '~/lib/utils';
import { SuggestionAction } from './suggestion-action';

const suggestions: Pick<User, 'id' | 'name' | 'image'>[] = [
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
  // {
  //   id: '7',
  //   name: 'Someone 7',
  //   image: undefined,
  // },
  // {
  //   id: '8',
  //   name: 'Someone 8',
  //   image: undefined,
  // },
  // {
  //   id: '9',
  //   name: 'Someone 9',
  //   image: undefined,
  // },
  // {
  //   id: '10',
  //   name: 'Someone 10',
  //   image: undefined,
  // },
];

const PAGE = 1;
const SUGGESTIONS_LIMIT = 10;

export const SuggestionsList = () => {
  if (!suggestions.length) {
    return (
      <NoUsersContainer>
        <p>There is nobody to suggest you to add to your friends list.</p>
      </NoUsersContainer>
    );
  }

  const moreThanLimit = suggestions.length > SUGGESTIONS_LIMIT - 1;
  const suggestionsSlice = getUsersSlice({
    users: suggestions,
    page: PAGE,
    perPage: SUGGESTIONS_LIMIT - 2,
  });

  return (
    <UsersContainer>
      <UsersList className="grid grid-cols-2 gap-x-8">
        {suggestionsSlice.map((suggestionUser) => (
          <UserItem
            key={suggestionUser.id}
            id={suggestionUser.id}
            name={suggestionUser.name}
            image={suggestionUser.image}
          >
            <SuggestionAction id={suggestionUser.id} />
          </UserItem>
        ))}
      </UsersList>
      {moreThanLimit && <UsersPagination />}
    </UsersContainer>
  );
};
