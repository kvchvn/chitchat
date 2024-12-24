import clsx from 'clsx';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ROUTES } from '~/constants/routes';
import { getNameInitials } from '~/lib/utils';
import { api } from '~/trpc/server';

export default async function UsersList(props: { params: Promise<{ slug: string[] }> }) {
  const allUsers = await api.users.getAll();
  const params = await props.params;

  if (params?.slug?.[1]) {
    redirect(`${ROUTES.chats}${params.slug[0]}`);
  }

  return (
    <ul className="flex flex-col">
      {allUsers.map((user) => (
        <li key={user.id} className="mr-2 border-b last:border-b-0">
          <Link
            href={user.id}
            className={clsx(
              'flex min-w-max items-center gap-2 py-4 pl-2 hover:bg-primary-hover-light active:bg-primary-active-light dark:border-b-slate-800 dark:hover:bg-primary-hover-dark dark:active:bg-primary-active-dark',
              {
                'bg-primary-hover-light dark:bg-primary-hover-dark': params?.slug[0] === user.id,
              }
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "user's avatar"} />
              <AvatarFallback className="text-sm">{getNameInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
