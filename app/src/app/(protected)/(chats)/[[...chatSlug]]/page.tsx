import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';
import { redirect } from 'next/navigation';

export default async function ChatPage(props: { params: Promise<{ chatSlug: string[] }> }) {
  const [params, session] = await Promise.all([props.params, getServerAuthSession()]);

  if (params?.chatSlug?.[1]) {
    redirect(`/${params.chatSlug[0]}`);
  }

  const companionId = params?.chatSlug?.[0];

  const chat = companionId
    ? await api.chats.getByMembersIds({ userId: session!.user.id, companionId })
    : null;

  if (!chat) {
    return <h2>No chat</h2>;
  }

  return (
    <section className="ml-2 h-full border">
      <header>headera</header>
    </section>
  );
}
