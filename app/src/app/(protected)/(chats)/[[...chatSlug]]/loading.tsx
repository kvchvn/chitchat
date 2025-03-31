import { ChatContainer } from '~/components/chat/chat-container';
import { ChatSkeleton } from '~/components/chat/chat-skeleton';
import { Skeleton } from '~/components/ui/skeleton';

export default function ChatPageLoading() {
  return (
    <ChatContainer className="flex-col items-start justify-stretch pb-1 pt-0">
      <header className="relative flex w-full items-center border-b border-slate-300 py-2 after:absolute after:left-0 after:top-full after:z-3 after:h-16 after:w-full after:translate-y-2 after:bg-gradient-to-b after:from-background-light after:to-transparent dark:after:from-background-dark">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="ml-auto h-8 w-8" />
      </header>
      <ChatSkeleton />
    </ChatContainer>
  );
}
