'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/constants/routes';
import { getAuthErrorDescription } from '~/lib/auth-errors';

export default function SignInErrorPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  if (!('error' in searchParams)) {
    redirect(ROUTES.signIn);
  } else {
    const errorDescription = getAuthErrorDescription(searchParams.error);

    return (
      <>
        <h2>{searchParams.error}</h2>
        <p className="text-sm">{errorDescription}</p>
        <div className="flex w-full justify-center gap-2 self-center max-[400px]:flex-col max-[400px]:gap-3">
          <Button asChild className="w-full xs:w-auto">
            <Link href={ROUTES.signIn}>Try again</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full xs:w-auto">
            <a href={ROUTES.signIn}>Reload page</a>
          </Button>
        </div>
      </>
    );
  }
}
