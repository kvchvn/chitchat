import { MessageCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { ROUTES } from '~/constants/routes';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function SignInWelcomePage() {
  // Checking is in (public)/layout.tsx
  const session = (await getServerAuthSession())!;

  if (!session.user.hasApprovedName) {
    redirect(ROUTES.signInUsername, RedirectType.replace);
  } else if (session.user.isNewUser) {
    await api.users.makeAsNotNew({ id: session.user.id });
  }

  return (
    <>
      <h2>Welcome!</h2>
      <h4>We&apos;re glad you&apos;ve joined our app!</h4>
      <div>
        <p className="px-4">
          If you have any questions or issues with the app, you can reply to our email:
        </p>
        <Link href="mailto:chitchat.app.2024@gmail.com" className="link mt-2">
          chitchat.app.2024@gmail.com
        </Link>
      </div>
      <div className="mt-8 flex w-full justify-center gap-3 max-xs:flex-col xs:mt-4">
        <Button variant="secondary" asChild>
          <Link href={ROUTES.profile}>
            <UserRound />
            Go to Profile
          </Link>
        </Button>
        <Button asChild>
          <Link replace={true} href={ROUTES.chats}>
            <MessageCircle />
            Go to Chats
          </Link>
        </Button>
      </div>
    </>
  );
}
