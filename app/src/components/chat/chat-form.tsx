import { SendHorizonal } from 'lucide-react';
import {
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useToast } from '~/hooks/use-toast';
import { generateChatDateKey } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';
import { useChatId } from '../contexts/chat-id-provider';
import { useUserId } from '../contexts/user-id-provider';

type Props = {
  onSubmitSideEffect: () => void;
};

export const ChatForm = ({ onSubmitSideEffect }: Props) => {
  const userId = useUserId();
  const companionId = useCompanionId();
  const chatId = useChatId();

  const utils = api.useUtils();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const timerIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { mutate: sendMessage } = api.messages.create.useMutation({
    onMutate: async (newMessage) => {
      setMessage('');

      await utils.chats.getByCompanionId.cancel({ companionId });

      const previousChat = utils.chats.getByCompanionId.getData();

      utils.chats.getByCompanionId.setData({ companionId }, (oldData) => {
        if (oldData) {
          const messageDraft: ChatMessage = {
            id: `${Math.random()}`,
            chatId: newMessage.chatId,
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            createdAt: new Date(),
            updatedAt: new Date(),
            isRead: newMessage.senderId === newMessage.receiverId,
            isSent: false,
          };

          const updatedMessagesMap = new Map(oldData.messagesMap);
          const dateKey = generateChatDateKey(messageDraft.createdAt);

          if (!updatedMessagesMap.has(dateKey)) {
            updatedMessagesMap.set(dateKey, []);
          }

          updatedMessagesMap.get(dateKey)?.push(messageDraft);

          return {
            chat: oldData.chat,
            messagesMap: updatedMessagesMap,
          };
        }

        return oldData;
      });

      onSubmitSideEffect();

      return { previousChat };
    },
    onError: (_, __, context) => {
      utils.chats.getByCompanionId.setData({ companionId }, context?.previousChat);

      toast({
        variant: 'destructive',
        title: 'Message sending failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: async () => {
      clearTimeout(timerIdRef.current);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      timerIdRef.current = setTimeout(async () => {
        await utils.chats.getByCompanionId.invalidate({ companionId });
      }, 1000);
    },
  });

  const onSubmit = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    sendMessage({
      chatId,
      senderId: userId,
      receiverId: companionId,
      text: trimmedMessage,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.ctrlKey && e.code === 'Enter') {
      setMessage((prevMessage) => `${prevMessage}\n`);
    } else if (!e.shiftKey && e.code === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timerIdRef.current);
    };
  }, []);

  return (
    <form
      onKeyDown={handleKeyDown}
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
        <SendHorizonal />
      </Button>
    </form>
  );
};
