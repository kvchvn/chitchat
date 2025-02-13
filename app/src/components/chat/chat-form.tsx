import { SendHorizonal } from 'lucide-react';
import { type ChangeEventHandler, type FormEventHandler, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/hooks/use-toast';
import { type ChatPretty } from '~/server/db/schema/chats';
import { api } from '~/trpc/react';
import { LoadingIcon } from '../ui/loading-icon';

type Props = {
  chat: ChatPretty;
};

export const ChatForm = ({ chat }: Props) => {
  const { mutateAsync: sendMessage, isPending } = api.messages.create.useMutation();
  const utils = api.useUtils();
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    sendMessage({
      chatId: chat.chatId,
      senderId: chat.userId,
      receiverId: chat.companionId,
      text: message.trim(),
    })
      .then(async () => {
        setMessage('');
        await utils.chats.getByMembersIds.invalidate({
          userId: chat.userId,
          companionId: chat.companionId,
        });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Message sending failed',
          description: 'Something went wrong. Please try again later',
        });
      });
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-auto flex w-full gap-4 border-t border-slate-300 pt-2">
      <Textarea
        className="w-full resize-none bg-slate-100 p-2 scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[6px] dark:bg-slate-700"
        value={message}
        placeholder="Type your message..."
        maxRows={8}
        onChange={handleChange}
      />
      <Button type="submit" size="icon-lg" disabled={!message} className="shrink-0 rounded-full">
        {!isPending ? <SendHorizonal /> : <LoadingIcon />}
      </Button>
    </form>
  );
};
