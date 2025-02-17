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
        <Button asChild>
          <Link href={ROUTES.signIn}>Try again</Link>
        </Button>
      </>
    );
  }
}
