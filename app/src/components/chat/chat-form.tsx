import { Check, SendHorizonal } from 'lucide-react';
import {
  type FocusEventHandler,
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

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
    e.target.scrollIntoView({ behavior: 'smooth' });
  };

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
      if (e.shiftKey) {
        // Move to the next line
        return;
      }

      if (e.ctrlKey) {
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
        textarea.focus();
        setTimeout(() => {
          textarea.scrollTo({ top: textarea.scrollHeight });
        });
      }
    } else {
      setMessage('');
    }
  }, [messageToEdit]);

  return (
    <form
      ref={formRef}
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      className="relative mt-auto flex w-full gap-4 border-t border-slate-300 pt-2 before:absolute before:bottom-[calc(100%+6px)] before:left-0 before:z-3 before:h-10 before:w-[calc(100%-8px)] before:-translate-y-[2px] before:bg-gradient-to-t before:from-background-light before:to-transparent dark:before:from-background-dark">
      <Textarea
        name={TEXTAREA_NAME}
        className="w-full resize-none bg-slate-100 p-2 scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px] dark:bg-slate-700"
        value={message}
        onFocus={handleFocus}
        placeholder="Type your message..."
        maxRows={8}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        size="icon-lg"
        disabled={!message || messageToEdit?.text === message}
        className="shrink-0 rounded-full">
        {messageToEdit ? <Check /> : <SendHorizonal />}
      </Button>
    </form>
  );
};
