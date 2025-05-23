import { redirect, RedirectType } from 'next/navigation';
import { AuthUsernameForm } from '~/components/auth/auth-username-form';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';

export default async function SignInUsername() {
  const session = await getServerAuthSession();

  if (session) {
    if (session.user.hasApprovedName) {
      redirect(ROUTES.chats, RedirectType.replace);
    }
  } else {
    redirect(ROUTES.signIn, RedirectType.replace);
  }

  return (
    <>
      <h1>Write your username</h1>
      <AuthUsernameForm user={session.user} />
    </>
  );
}
