import { redirect } from 'next/navigation';
import { ChatContainer } from '~/components/chat/chat-container';
import { ChatNotFound } from '~/components/chat/chat-not-found';
import { ChatSettings } from '~/components/chat/chat-settings';
import { ChatWindow } from '~/components/chat/chat-window';
import { UserIdProvider } from '~/components/contexts/user-id-provider';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function ChatPage(props: { params: Promise<{ chatSlug: string[] }> }) {
  const [params, session] = await Promise.all([props.params, getServerAuthSession()]);

  if (params?.chatSlug?.[1]) {
    redirect(`/${params.chatSlug[0]}`);
  }

  const companion = await api.users.isExisting({ id: params?.chatSlug?.[0] });

  if (!companion || !session) {
    return <ChatNotFound />;
  }

  return (
    <ChatContainer className="flex-col items-start justify-stretch pb-1 pt-0">
      <header className="relative flex w-full items-center border-b border-slate-300 py-2 after:absolute after:left-0 after:top-full after:z-3 after:h-10 after:w-full after:translate-y-2 after:bg-gradient-to-b after:from-background-light after:to-transparent dark:after:from-background-dark">
        <h3>{companion.name}</h3>
        <UserIdProvider userId={session.user.id}>
          <ChatSettings />
        </UserIdProvider>
      </header>
      <UserIdProvider userId={session.user.id}>
        <ChatWindow companionName={companion.name} />
      </UserIdProvider>
    </ChatContainer>
  );
}
