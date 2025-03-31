import { SendHorizonal } from 'lucide-react';
import {
  type FormEventHandler,
  type KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { useEditMessageOptimisticMutation } from '~/hooks/mutations/use-edit-message-optimistic-mutation';
import { useSendMessageOptimisticMutation } from '~/hooks/mutations/use-send-message-optimistic-mutation';
import { useCompanionId } from '~/hooks/use-companion-id';
import { generateChatDateKey } from '~/lib/utils';
import { useStore } from '~/store/store';
import { useChatId } from '../contexts/chat-id-provider';
import { useUserId } from '../contexts/user-id-provider';

type Props = {
  onFormSubmitSideEffect: () => void;
};

export const ChatForm = ({ onFormSubmitSideEffect }: Props) => {
  const TEXTAREA_NAME = 'message';

  const userId = useUserId();
  const companionId = useCompanionId();
  const chatId = useChatId();

  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const messageToEdit = useStore.use.messageToEdit();
  const setMessageToEdit = useStore.use.setMessageToEdit();

  const onSendMessageSideEffect = () => {
    setMessage('');
    onFormSubmitSideEffect();
  };

  const onEditMessageSideEffect = () => {
    setMessage('');
    setMessageToEdit(null);
  };

  const { mutate: sendMessage } = useSendMessageOptimisticMutation({
    onMutateSideEffect: onSendMessageSideEffect,
  });

  const { mutate: editMessage } = useEditMessageOptimisticMutation({
    onMutateSideEffect: onEditMessageSideEffect,
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!messageToEdit) {
      sendMessage({
        chatId,
        senderId: userId,
        receiverId: companionId,
        text: trimmedMessage,
      });
    } else {
      editMessage({
        id: messageToEdit.id,
        newText: trimmedMessage,
        receiverId: messageToEdit.receiverId,
        dateKey: generateChatDateKey(messageToEdit.createdAt),
      });
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.code === 'Enter') {
      if (e.ctrlKey || e.shiftKey) {
        setMessage((prevMessage) => `${prevMessage}\n`);
      } else {
        handleSubmit(e);
      }
    }
  };

  useEffect(() => {
    if (messageToEdit) {
      setMessage(messageToEdit?.text);

      const textarea = formRef.current?.elements.namedItem(TEXTAREA_NAME);

      if (textarea instanceof HTMLElement) {
        console.log('focus');
        textarea.focus();
      }
    } else {
      setMessage('');
    }
  }, [messageToEdit]);

  console.log('RENDER', message);

  return (
    <form
      ref={formRef}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      className="mt-auto flex w-full gap-4 border-t border-slate-300 pt-2">
      <Textarea
        name={TEXTAREA_NAME}
        className="w-full resize-none bg-slate-100 p-2 scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px] dark:bg-slate-700"
        value={message}
        placeholder="Type your message..."
        maxRows={8}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button type="submit" size="icon-lg" disabled={!message} className="shrink-0 rounded-full">
        <SendHorizonal />
      </Button>
    </form>
  );
};
