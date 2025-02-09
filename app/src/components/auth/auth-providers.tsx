'use client';

import { type getProviders } from 'next-auth/react';
import { AuthProvider } from './auth-provider';

type Props = {
  providers: NonNullable<Awaited<ReturnType<typeof getProviders>>>;
};

export const AuthProviders = ({ providers }: Props) => {
  return (
    <ul className="flex w-full max-w-[300px] flex-col items-stretch gap-4 xs:max-w-full xs:px-8">
      {Object.values(providers).map((provider) => (
        <li key={provider.id}>
          <AuthProvider
            id={provider.id as React.ComponentProps<typeof AuthProvider>['id']}
            name={provider.name}
          />
        </li>
      ))}
    </ul>
  );
};
