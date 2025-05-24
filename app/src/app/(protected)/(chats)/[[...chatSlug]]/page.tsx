import { redirect, RedirectType } from 'next/navigation';
import { ChatContainer } from '~/components/chat/chat-container';
import { ChatNotFound } from '~/components/chat/chat-not-found';
import { ChatSearch } from '~/components/chat/chat-search';
import { ChatSettings } from '~/components/chat/chat-settings';
import { ChatWindow } from '~/components/chat/chat-window';
import { UserIdProvider } from '~/components/contexts/user-id-provider';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { NOTES_TITLE } from '~/constants/global';
import { ROUTES } from '~/constants/routes';
import { cn, getNameInitials } from '~/lib/utils';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function ChatPage(props: { params: Promise<{ chatSlug: string[] }> }) {
  const [params, session] = await Promise.all([props.params, getServerAuthSession()]);

  if (!session) {
    redirect(ROUTES.signIn, RedirectType.replace);
  }

  if (params?.chatSlug?.[1]) {
    redirect(`/${params.chatSlug[0]}`, RedirectType.replace);
  }

  const companion = await api.users.isExisting({ id: params?.chatSlug?.[0] });

  if (!companion) {
    return <ChatNotFound />;
  }

  const isUsersNotes = companion.id === session.user.id;
  const formattedName = isUsersNotes ? NOTES_TITLE : companion.name;

  return (
    <ChatContainer className="flex-col items-start justify-stretch">
      <header className="relative flex min-h-12 w-full items-center gap-2 border-b border-slate-300 py-2 after:absolute after:left-0 after:top-full after:z-3 after:h-10 after:w-full after:translate-y-2 after:bg-gradient-to-b after:from-background-light after:to-transparent dark:after:from-background-dark">
        <Avatar className={cn('h-8 w-8 lg:hidden', isUsersNotes && 'rounded-none')}>
          <AvatarImage
            src={isUsersNotes ? '/svg/bookmark.svg' : (companion.image ?? undefined)}
            alt={formattedName ?? 'Companion avatar'}
            className={cn(isUsersNotes && 'bg-transparent dark:bg-transparent')}
          />
          <AvatarFallback className="text-sm">{getNameInitials(formattedName)}</AvatarFallback>
        </Avatar>
        <h3 className="mr-auto">
          {session.user.id === companion.id ? NOTES_TITLE : companion.name}
        </h3>
        <UserIdProvider userId={session.user.id}>
          <ChatSearch />
          <ChatSettings />
        </UserIdProvider>
      </header>
      <UserIdProvider userId={session.user.id}>
        <ChatWindow companionName={companion.name} />
      </UserIdProvider>
    </ChatContainer>
  );
}
