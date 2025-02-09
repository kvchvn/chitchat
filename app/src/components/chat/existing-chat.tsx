import { EllipsisVertical, SendHorizonal } from 'lucide-react';
import { ChatContainer } from '~/components/chat/chat-container';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';

type Props = {
  companionName: string | null;
};

export const ExistingChat = ({ companionName }: Props) => {
  return (
    <ChatContainer className="flex-col items-start justify-stretch py-0">
      <header className="flex w-full items-center border-b border-slate-300 py-2">
        <h3>{companionName}</h3>
        <Button size="icon-sm" variant="outline" className="ml-auto">
          <EllipsisVertical />
        </Button>
      </header>
      <div className="my-2 w-full grow border border-red-400">
        <ul className="flex h-full flex-col justify-end">
          <li>Message 1</li>
          <li className="self-end">Message 2</li>
        </ul>
      </div>
      <div className="mt-auto flex w-full gap-4 border-t border-slate-300 pt-2">
        <Textarea
          className="scrollbar scrollbar-w-[6px] scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg w-full resize-none rounded-sm bg-slate-200 p-2 dark:bg-slate-700"
          defaultValue="text"
          maxRows={8}
        />
        <Button size="icon-lg" className="rounded-full">
          <SendHorizonal />
        </Button>
      </div>
    </ChatContainer>
  );
};
