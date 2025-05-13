import { Wrapper } from '../ui/wrapper';
import { ProfilePromoAvatar } from './profile-promo-avatar';
import { ProfilePromoName } from './profile-promo-name';

export const ProfilePromo = () => {
  return (
    <div className="relative -ml-4 min-h-52 w-screen shrink-0 bg-gradient-to-b from-primary-active-light/50 via-primary-hover-light/50 to-primary-light/50 pb-24 pt-8 dark:from-primary-active-dark/50 dark:via-primary-hover-dark/50 dark:to-background-dark xs:-ml-6 sm:pb-8 md:-ml-12 lg:min-h-40 xl:-ml-16 2xl:-ml-[calc((100vw-1440px)/2+4rem)]">
      <Wrapper>
        <ProfilePromoAvatar />
        <ProfilePromoName />
      </Wrapper>
    </div>
  );
};
