'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

type Props = {
  receiverId: string;
  senderId: string;
  receiverName: string | null;
  invalidateKey?: Extract<
    keyof ReturnType<(typeof api)['useUtils']>['user'],
    'getSuggestedUsers' | 'getUserOutcomingFriendRequests'
  >;
};

export const CancelFriendRequestAction = ({
  receiverId,
  senderId,
  receiverName,
  invalidateKey,
}: Props) => {
  const cancelFriendRequest = api.user.cancelFriendRequest.useMutation();
  const utils = api.useUtils();
  const { toast } = useToast();

  const toFormatName = receiverName ? ` to ${receiverName}` : '';

  const handleClick = async () => {
    try {
      await cancelFriendRequest.mutateAsync({ senderId, receiverId });

      toast({
        title: 'Success!',
        description: `You\'ve just cancelled friend request${toFormatName}`,
      });

      if (invalidateKey) {
        await utils.user[invalidateKey].invalidate();
      }
    } catch (err) {
      console.trace(err);

      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `Cancelling friend request${toFormatName} failed. Try again`,
      });
    }
  };

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
