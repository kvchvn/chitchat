'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { RemoveFriendAction } from './remove-friend-action';
import { SendFriendRequestAction } from './send-friend-request-action';

type Props = {
  receiverId: string;
  senderId: string;
  senderName: string | null;
};

export const RespondToFriendRequest = ({ receiverId, senderId, senderName }: Props) => {
  const acceptFriendRequest = api.user.acceptFriendRequest.useMutation();
  const rejectFriendRequest = api.user.cancelFriendRequest.useMutation();
  const { toast } = useToast();

  const fromFormatName = senderName ? ` from ${senderName}` : '';

  const handleAccept = async () => {
    try {
      await acceptFriendRequest.mutateAsync({ senderId, receiverId });

      toast({
        title: 'Success!',
        description: `You\'ve just accepted friend request${fromFormatName}`,
      });
    } catch (err) {
      console.trace(err);

      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `Accepting friend request${fromFormatName} failed. Try again`,
      });
    }
  };

  const handleReject = async () => {
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

  if (acceptFriendRequest.isSuccess) {
    return <RemoveFriendAction userId={receiverId} friendId={senderId} friendName={senderName} />;
  }

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
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAccept}
        disabled={acceptFriendRequest.isPending}
        className="hover:text-success-hover-light dark:hover:text-success-hover-dark"
      >
        {acceptFriendRequest.isPending ? (
          <Icon scope="global" id="pending" className="animate-spin" />
        ) : (
          <Icon scope="global" id="check" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReject}
        disabled={rejectFriendRequest.isPending}
        className="hover:text-error-hover-light dark:hover:text-error-hover-dark"
      >
        {rejectFriendRequest.isPending ? (
          <Icon scope="global" id="pending" className="animate-spin" />
        ) : (
          <Icon scope="global" id="close" />
        )}
      </Button>
    </div>
  );
};
