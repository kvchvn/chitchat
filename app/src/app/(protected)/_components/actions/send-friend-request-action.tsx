'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { CancelFriendRequestAction } from './cancel-friend-request-action';

type Props = {
  receiverId: string;
  senderId: string;
  receiverName: string | null;
};

export const SendFriendRequestAction = ({ receiverId, senderId, receiverName }: Props) => {
  const sendFriendRequest = api.user.sendFriendRequest.useMutation();
  const { toast } = useToast();

  const toFormatName = receiverName ? ` to ${receiverName}` : '';

  const handleClick = async () => {
    try {
      await sendFriendRequest.mutateAsync({ senderId, receiverId });

      toast({
        title: 'Success!',
        description: `You\'ve just sent friend request${toFormatName}`,
      });
    } catch (err) {
      console.trace(err);

      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `Sending friend request${toFormatName} failed. Try again later`,
      });
    }
  };

  if (sendFriendRequest.isSuccess) {
    return (
      <CancelFriendRequestAction
        senderId={senderId}
        receiverId={receiverId}
        receiverName={receiverName}
      />
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={sendFriendRequest.isPending}
      className="ml-auto"
    >
      {sendFriendRequest.isPending ? (
        <Icon scope="global" id="pending" className="animate-spin" />
      ) : (
        <Icon scope="friends" id="add-friend" />
      )}
      Add to friends
    </Button>
  );
};
