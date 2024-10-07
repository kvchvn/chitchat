'use client';

import { signIn, type getProviders } from 'next-auth/react';
import { Button } from '~/components/ui/button';

type Props = {
  providers: NonNullable<Awaited<ReturnType<typeof getProviders>>>;
};

export const Providers = ({ providers }: Props) => {
  return (
    <ul className="flex w-full flex-col items-stretch gap-4">
      {Object.values(providers).map((provider) => (
        <li key={provider.id}>
          <Button
            variant="transparent"
            size="lg"
            fullwidth
            className="hover: bg-[#4285f4] text-text-dark"
            onClick={() => signIn(provider.id)}
          >
            Sign In with {provider.name}
          </Button>
        </li>
      ))}
    </ul>
  );
};
