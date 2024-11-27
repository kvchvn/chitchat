'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { SendFriendRequestAction } from './send-friend-request-action';

type Props = {
  receiverId: string;
  senderId: string;
  senderName: string | null;
};

export const RejectFriendRequestAction = ({ receiverId, senderId, senderName }: Props) => {
  const rejectFriendRequest = api.user.cancelFriendRequest.useMutation();
  const { toast } = useToast();

  const fromFormatName = senderName ? ` from ${senderName}` : '';

  const handleClick = async () => {
    try {
      await rejectFriendRequest.mutateAsync({ senderId, receiverId });

      toast({
        title: 'Success!',
        description: `You\'ve just rejected friend request${fromFormatName}`,
      });
    } catch (err) {
      console.trace(err);

      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `Rejecting friend request${fromFormatName} failed. Try again later`,
      });
    }
  };

  if (rejectFriendRequest.isSuccess) {
    return (
      <SendFriendRequestAction
        senderId={receiverId}
        receiverId={senderId}
        receiverName={senderName}
      />
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      disabled={rejectFriendRequest.isPending}
      className="ml-auto"
    >
      {rejectFriendRequest.isPending ? (
        <Icon scope="global" id="pending" className="animate-spin" />
      ) : (
        <Icon scope="global" id="close" />
      )}
      Reject request
    </Button>
  );
};
