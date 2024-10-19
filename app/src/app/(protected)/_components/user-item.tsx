import { type User } from 'next-auth';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { getNameInitials } from '~/lib/utils';

type Props = React.PropsWithChildren & {
  id: User['id'];
  name: User['name'];
  image: User['image'];
  online?: boolean;
};

export const UserItem = ({ id, name, image, online, children }: Props) => {
  const nameInitials = getNameInitials(name);

  return (
    <li className="flex items-center gap-2 rounded-xl p-1">
      <Avatar className="h-10 w-10" asChild>
        <Link href={`/${id}`}>
          <AvatarImage src={image ?? undefined} alt={name ?? 'Anonymous'} />
          <AvatarFallback>{nameInitials}</AvatarFallback>
        </Link>
      </Avatar>
      <div className="flex flex-col gap-1">
        <Link
          href={`/${id}`}
          className="text-sm hover:text-highlight-light dark:hover:text-highlight-dark"
        >
          {name}
        </Link>
        {typeof online === 'boolean' && <Badge>{online ? 'online' : 'offline'}</Badge>}
      </div>
      {/* Action button(s) */}
      {children}
    </li>
  );
};
