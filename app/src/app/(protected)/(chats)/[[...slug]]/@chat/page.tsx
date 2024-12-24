import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

export default async function ChatWindow(props: { params: Promise<{ slug: string[] }> }) {
  const [params, session] = await Promise.all([props.params, getServerAuthSession()]);
  const companionId = params?.slug[0];
  const chat = await api.chats.getByMembersIds({ userId: session!.user.id, companionId });

  if (!chat) {
  }

  return (
    <section className="ml-2 h-full border">
      <header>header</header>
    </section>
  );
}
