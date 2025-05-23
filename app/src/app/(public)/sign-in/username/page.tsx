import { redirect, RedirectType } from 'next/navigation';
import { AuthUsernameForm } from '~/components/auth/auth-username-form';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function SignInUsername() {
  // Checking is in (public)/layout.tsx
  const session = (await getServerAuthSession())!;

  if (session.user.hasApprovedName && session.user.isNewUser) {
    redirect(ROUTES.signInWelcome, RedirectType.replace);
  }

  return (
    <>
      <h1>Write your username</h1>
      <AuthUsernameForm user={session.user} />
    </>
  );
}
