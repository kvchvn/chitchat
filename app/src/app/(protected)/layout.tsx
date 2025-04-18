import { redirect } from 'next/navigation';
import type React from 'react';
import { EventsSubscriber } from '~/components/global/events-subscriber';
import { Header } from '~/components/global/header';
import { HeaderDynamicBg } from '~/components/global/header-dynamic-bg';
import { Wrapper } from '~/components/ui/wrapper';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function ProtectedLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(ROUTES.signIn);
  }

  return (
    <>
      <EventsSubscriber />
      <HeaderDynamicBg>
        <Header />
      </HeaderDynamicBg>
      <main className="relative mt-12 flex max-h-full grow items-stretch bg-background-light pb-6 dark:bg-background-dark">
        <Wrapper>{children}</Wrapper>
      </main>
    </>
  );
}
