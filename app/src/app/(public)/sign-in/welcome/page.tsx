import { MessageCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function SignInWelcomePage() {
  const session = await getServerAuthSession();

  if (session) {
    if (session.user.isNewUser) {
      await api.users.makeAsNotNew({ id: session.user.id });
    }
  } else {
    redirect(ROUTES.signIn);
  }

  return (
    <>
      <h2>Welcome!</h2>
      <h4>We are happy you are using our app</h4>
      <div>
        <p>If you will have questions or problems with the app, you can respond to our email:</p>
        <Link href="mailto:chitchat.app.2024@gmail.com" className="link mt-2">
          chitchat.app.2024@gmail.com
        </Link>
      </div>
      <div className="mt-8 flex gap-3 xs:mt-4">
        <Button variant="secondary" asChild>
          <Link href={ROUTES.profile}>
            <UserRound />
            Go to Profile
          </Link>
        </Button>
        <Button asChild>
          <Link href={ROUTES.chats}>
            <MessageCircle />
            Go to Chats
          </Link>
        </Button>
      </div>
    </>
  );
}
