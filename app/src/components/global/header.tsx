import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ThemeToggler } from '~/components/ui/theme-toggler';
import { Wrapper } from '~/components/ui/wrapper';
import { getNameInitials } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';

export const Header = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  const nameInitials = getNameInitials(session.user.name);

  return (
    <header className="fixed w-full bg-slate-100 py-2 dark:bg-slate-700">
      <Wrapper className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggler className="h-8 w-8 rounded-full" />
          <Avatar>
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? "user's avatar"}
            />
            <AvatarFallback className="text-sm">{nameInitials}</AvatarFallback>
          </Avatar>
        </div>
      </Wrapper>
    </header>
  );
};
