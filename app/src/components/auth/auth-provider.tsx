'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { signIn } from 'next-auth/react';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { ROUTES } from '~/constants/routes';
import { cn } from '~/lib/utils';

const providerVariants = cva(
  'bg-transparent dark:bg-slate-800 dark:border-transparent dark:hover:border-transparent border border-current hover:border-current flex items-center gap-2',
  {
    variants: {
      id: {
        google:
          'hover:bg-auth-google-hover-light active:bg-auth-google-active-light dark:hover:bg-auth-google-hover-dark dark:active:bg-auth-google-active-dark',
        github:
          'hover:bg-auth-github-hover-light active:bg-auth-github-active-light dark:hover:bg-auth-github-hover-dark dark:active:bg-auth-github-active-dark',
        yandex:
          'hover:bg-auth-yandex-hover-light active:bg-auth-yandex-active-light dark:hover:bg-auth-yandex-hover-dark dark:active:bg-auth-yandex-active-dark',
        facebook:
          'hover:bg-auth-facebook-hover-light active:bg-auth-facebook-active-light dark:hover:bg-auth-facebook-hover-dark dark:active:bg-auth-facebook-active-dark',
      },
    },
  }
);

type ProviderVariants = VariantProps<typeof providerVariants>;

type Props = Required<Pick<ProviderVariants, 'id'>> & {
  name: string;
};

export const AuthProvider = ({ id, name }: Props) => {
  const handleClick = async () => {
    // TODO: add error-toast
    if (id) {
      /**
       * if the user signs in not for the first time
       * he/she will be redirected to main page (from layout.tsx)
       */
      await signIn(id, { callbackUrl: ROUTES.signInWelcome });
    }
  };

  return (
    <Button
      variant="transparent"
      size="lg"
      fullWidth
      className={cn(providerVariants({ id }))}
      onClick={handleClick}>
      {id && <Icon scope="auth" id={id} />}
      Sign In with {name}
    </Button>
  );
};
