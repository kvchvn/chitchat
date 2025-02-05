import { api } from '~/trpc/server';
import { UserItemMemo } from '~/app/(protected)/(chats)/_components/user-item';

export default async function UsersList() {
  const allUsers = await api.users.getAll();

  return (
    <ul className="flex flex-col">
      {allUsers.map((user) => (
        <UserItemMemo key={user.id} id={user.id} name={user.name} image={user.image} />
      ))}
    </ul>
  );
}
