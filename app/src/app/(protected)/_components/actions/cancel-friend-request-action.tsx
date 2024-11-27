'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { SendFriendRequestAction } from './send-friend-request-action';

type Props = {
  receiverId: string;
  senderId: string;
  receiverName: string | null;
};

export const CancelFriendRequestAction = ({ receiverId, senderId, receiverName }: Props) => {
  const cancelFriendRequest = api.user.cancelFriendRequest.useMutation();
  const { toast } = useToast();

  const toFormatName = receiverName ? ` to ${receiverName}` : '';

  const handleClick = async () => {
    try {
      await cancelFriendRequest.mutateAsync({ senderId, receiverId });

      toast({
        title: 'Success!',
        description: `You\'ve just cancelled friend request${toFormatName}`,
      });
    } catch (err) {
      console.trace(err);

      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `Cancelling friend request${toFormatName} failed. Try again later`,
      });
    }
  };

  if (cancelFriendRequest.isSuccess) {
    return (
      <SendFriendRequestAction
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
      disabled={cancelFriendRequest.isPending}
      className="ml-auto"
    >
      {cancelFriendRequest.isPending ? (
        <Icon scope="global" id="pending" className="animate-spin" />
      ) : (
        <Icon scope="global" id="close" />
      )}
      Cancel request
    </Button>
  );
};
