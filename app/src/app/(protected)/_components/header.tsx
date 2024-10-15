import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ThemeToggler } from '~/components/ui/theme-toggler';
import { getNameInitials } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';

export const Header = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  const nameInitials = getNameInitials(session.user.name);

  return (
    <header className="flex items-center gap-2 py-2">
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggler className="h-8 w-8 rounded-full" />
        <div className="flex items-center gap-1">
          <Avatar>
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? "user's avatar"}
            />
            <AvatarFallback className="text-sm">{nameInitials}</AvatarFallback>
          </Avatar>
          {/* <span className="text-sm">{session.user.name ?? 'nice person'}</span> */}
        </div>
      </div>
    </header>
  );
};
