'use client';

import { type getProviders } from 'next-auth/react';
import { Provider } from './provider';

type Props = {
  providers: NonNullable<Awaited<ReturnType<typeof getProviders>>>;
};

export const Providers = ({ providers }: Props) => {
  return (
    <ul className="xs:max-w-full xs:px-8 flex w-full max-w-[300px] flex-col items-stretch gap-4">
      {Object.values(providers).map((provider) => (
        <li key={provider.id}>
          <Provider
            id={provider.id as React.ComponentProps<typeof Provider>['id']}
            name={provider.name}
          />
        </li>
      ))}
    </ul>
  );
};
