import Link from 'next/link';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';
import { HydrateClient } from '~/trpc/server';

export default async function Home() {
  const session = (await getServerAuthSession())!;

  return (
    <HydrateClient>
      <Link href={ROUTES.friends} className="link">
        see friends
      </Link>
    </HydrateClient>
  );
}
