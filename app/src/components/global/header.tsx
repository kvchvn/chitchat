import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { ThemeToggler } from '~/components/ui/theme-toggler';
import { Wrapper } from '~/components/ui/wrapper';
import { ROUTES } from '~/constants/routes';
import { getNameInitials } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';
import { HeaderLinkBack } from './header-link-back';

export const Header = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  const nameInitials = getNameInitials(session.user.name);

  return (
    <Wrapper className="flex items-center">
      <div className="flex w-full items-center gap-2">
        <HeaderLinkBack />
        <ThemeToggler className="ml-auto h-8 w-8 rounded-full" />
        <Link href={ROUTES.profile}>
          <Avatar>
            <AvatarImage
              src={session.user.image ?? undefined}
              alt={session.user.name ?? 'Your avatar'}
              className="hover:contrast-125"
            />
            <AvatarFallback className="text-sm hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-600">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </Wrapper>
  );
};
