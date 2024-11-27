'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';
import { RemoveFriendAction } from './remove-friend-action';

type Props = {
  receiverId: string;
  senderId: string;
  senderName: string | null;
};

export const AcceptFriendRequestAction = ({ receiverId, senderId, senderName }: Props) => {
  const acceptFriendRequest = api.user.acceptFriendRequest.useMutation();
  const { toast } = useToast();

  const fromFormatName = senderName ? ` from ${senderName}` : '';

  const handleClick = async () => {
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

  if (acceptFriendRequest.isSuccess) {
    return <RemoveFriendAction userId={receiverId} friendId={senderId} friendName={senderName} />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={acceptFriendRequest.isPending}
      className="ml-auto"
    >
      {acceptFriendRequest.isPending ? (
        <Icon scope="global" id="pending" className="animate-spin" />
      ) : (
        <Icon scope="global" id="check" />
      )}
    </Button>
  );
};
