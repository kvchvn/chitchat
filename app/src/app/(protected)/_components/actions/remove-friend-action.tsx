'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { SendFriendRequestAction } from './send-friend-request-action';

type Props = {
  userId: string;
  friendId: string;
  friendName: string | null;
};

export const RemoveFriendAction = ({ userId, friendId, friendName }: Props) => {
  const removeFriend = api.user.removeFromFriends.useMutation();
  const { toast } = useToast();

  const formatName = friendName ? ` ${friendName}` : '';

  const handleClick = async () => {
    try {
      await removeFriend.mutateAsync({ userId, friendId });

      toast({
        title: 'Success!',
        description: `You\'ve just removed${formatName} from friends`,
      });
    } catch (err) {
      console.trace(err);

      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `Removing${formatName} from friends failed. Try again`,
      });
    }
  };

  if (removeFriend.isSuccess) {
    return (
      <SendFriendRequestAction senderId={userId} receiverId={friendId} receiverName={friendName} />
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={removeFriend.isPending}
      className="ml-auto"
    >
      {removeFriend.isPending ? (
        <Icon scope="global" id="pending" className="animate-spin" />
      ) : (
        <Icon scope="friends" id="remove-friend" />
      )}
      Remove from friends
    </Button>
  );
};
