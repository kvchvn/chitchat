import { Heart, HeartOff } from 'lucide-react';
import { DropdownMenuItem } from '~/components/ui/dropdown-menu';
import { useLikeMessageOptimisticMutation } from '~/hooks/mutations/use-like-message-optimistic-mutation';
import { generateChatDateKey } from '~/lib/utils';
import { type ChatMessage } from '~/server/db/schema/messages';

type Props = {
  message: ChatMessage;
};

export const LikeMessageDropdownItem = ({ message }: Props) => {
  const { mutate: toggleLikeMessage, isPending } = useLikeMessageOptimisticMutation();

  const handleClick = () => {
    const dateKey = generateChatDateKey(message.createdAt);

    toggleLikeMessage({ id: message.id, dateKey, like: !message.isLiked });
  };

  return (
    <DropdownMenuItem onClick={handleClick} disabled={isPending}>
      {message.isLiked ? <HeartOff /> : <Heart />}
      {message.isLiked ? 'Unlike' : 'Like'}
    </DropdownMenuItem>
  );
};
