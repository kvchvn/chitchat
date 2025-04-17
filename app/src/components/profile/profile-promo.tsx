import { type Session } from 'next-auth';
import { cn, getNameInitials } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Wrapper } from '../ui/wrapper';

type Props = {
  user: Session['user'];
};

export const ProfilePromo = ({ user }: Props) => {
  const nameInitials = getNameInitials(user.name);
  const name = user.name ?? 'Profile';

  return (
    <div className="relative -ml-4 min-h-52 w-screen shrink-0 bg-gradient-to-b from-primary-active-light/50 via-primary-hover-light/50 to-primary-light/50 pb-24 pt-8 dark:from-primary-active-dark/50 dark:via-primary-hover-dark/50 dark:to-background-dark xs:-ml-6 sm:pb-8 md:-ml-12 md:min-h-40 xl:-ml-16 2xl:-ml-[calc((100vw-1440px)/2+4rem)]">
      <Wrapper>
        <Avatar className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 translate-y-1/2 border-8 border-background-light dark:border-background-dark md:left-[unset] md:h-36 md:w-36 md:translate-x-0 md:translate-y-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'Avatar'} />
          <AvatarFallback className="text-4xl tracking-wider">{nameInitials}</AvatarFallback>
        </Avatar>
        <h1
          className={cn(
            'ml-auto max-w-full break-words text-center text-5xl tracking-wide md:max-w-[70%] md:text-right',
            {
              'text-4xl': name.length > 20,
              'text-5xl sm:text-6xl': name.length <= 20,
            }
          )}>
          {name}
        </h1>
      </Wrapper>
    </div>
  );
};
