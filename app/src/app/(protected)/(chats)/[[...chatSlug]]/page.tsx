import { redirect } from 'next/navigation';
import { ChatNotFound } from '~/components/chat/chat-not-found';
import { ChatWindow } from '~/components/chat/chat-window';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function ChatPage(props: { params: Promise<{ chatSlug: string[] }> }) {
  const [params, session] = await Promise.all([props.params, getServerAuthSession()]);

  if (params?.chatSlug?.[1]) {
    redirect(`/${params.chatSlug[0]}`);
  }

  const companion = await api.users.isExisting({ id: params?.chatSlug?.[0] });

  if (!companion) {
    return <ChatNotFound />;
  }

  return (
    <ChatWindow
      userId={session!.user.id}
      companionId={companion.id}
      companionName={companion.name}
    />
  );
}
