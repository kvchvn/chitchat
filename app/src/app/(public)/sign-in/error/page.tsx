import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/constants/routes';

export default function SignInErrorPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <>
      <h2>{'error' in searchParams ? searchParams.error : ''}</h2>
      <p className="text-sm">
        Your sign in request is failed. Please, try to sign in via another provider or go back
        later, maybe there are temporary troubles.
      </p>
      <Button asChild>
        <Link href={ROUTES.signIn}>Try again</Link>
      </Button>
    </>
  );
}
