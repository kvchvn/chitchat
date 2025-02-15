import { EllipsisVertical } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ChatContainer } from '~/components/chat/chat-container';
import { ChatNotFound } from '~/components/chat/chat-not-found';
import { ChatWindow } from '~/components/chat/chat-window';
import { Button } from '~/components/ui/button';
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
    <ChatContainer className="flex-col items-start justify-stretch pb-1 pt-0">
      <header className="after:z-3 relative flex w-full items-center border-b border-slate-300 py-2 after:absolute after:left-0 after:top-full after:h-16 after:w-full after:translate-y-2 after:bg-gradient-to-b after:from-background-light after:to-transparent dark:after:from-background-dark">
        <h3>{companion.name}</h3>
        <Button size="icon-sm" variant="outline" className="ml-auto">
          <EllipsisVertical />
        </Button>
      </header>
      <ChatWindow
        userId={session!.user.id}
        companionId={companion.id}
        companionName={companion.name}
      />
    </ChatContainer>
  );
}
