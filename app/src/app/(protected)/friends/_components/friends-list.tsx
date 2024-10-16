import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';

type Props = {
  friends: { name: string; online: boolean }[];
};

export const FriendsList = ({ friends }: Props) => {
  if (!friends.length) {
    return (
      <div className="flex flex-col gap-1 self-center text-center text-xs text-slate-500 dark:text-slate-400">
        <p>You don&apos;t have friends here.</p>
        <p>To add new friends see the all users list or invite yours friends</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3 self-stretch">
      <li className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100">
        <Avatar className="h-10 w-10">
          <AvatarImage src={undefined} alt="AK alt" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="text-sm">Name Surname</span>
          <Badge>online</Badge>
        </div>
        <Button variant="link" className="ml-auto">
          <Icon scope="friends" id="remove-friend" />
          Remove
        </Button>
      </li>
    </ul>
  );
};
