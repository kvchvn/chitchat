import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';
import { redirect } from 'next/navigation';
import { ChatNotFound } from '~/components/chat/chat-not-found';
import { ChatIsNotCreated } from '~/components/chat/chat-is-not-created';

export default async function ChatPage(props: { params: Promise<{ chatSlug: string[] }> }) {
  const [params, session] = await Promise.all([props.params, getServerAuthSession()]);

  if (params?.chatSlug?.[1]) {
    redirect(`/${params.chatSlug[0]}`);
  }

  const companionId = params?.chatSlug?.[0] ?? '';

  const existingCompanionPromise = api.users.isExisting({ id: companionId });
  const chatPromise = api.chats.getByMembersIds({ userId: session!.user.id, companionId });

  const [companion, chat] = await Promise.all([existingCompanionPromise, chatPromise]);

  if (!companion) {
    return <ChatNotFound />;
  }

  if (!chat) {
    return <ChatIsNotCreated />;
  }

  return (
    <section className="ml-2 h-full border">
      <header>headera</header>
    </section>
  );
}
