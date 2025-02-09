import { UserItemMemo } from '~/components/user/user-item';
import { api } from '~/trpc/server';

export const UsersList = async () => {
  const allUsers = await api.users.getAll();

  return (
    <ul className="flex flex-col">
      {allUsers.map((user) => (
        <UserItemMemo key={user.id} id={user.id} name={user.name} image={user.image} />
      ))}
    </ul>
  );
};
