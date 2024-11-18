'use client';

import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/trpc/react';

type Props = {
  receiverId: string;
  senderId: string;
  receiverName: string | null;
  invalidateKey?: Extract<keyof ReturnType<(typeof api)['useUtils']>['user'], 'getSuggestedUsers'>;
};

export const SendFriendRequestAction = ({
  receiverId,
  senderId,
  receiverName,
  invalidateKey,
}: Props) => {
  const sendFriendRequest = api.user.sendFriendRequest.useMutation();
  const utils = api.useUtils();
  const { toast } = useToast();

  const toFormatName = receiverName ? ` to ${receiverName}` : '';

  const handleClick = () => {
    // try {
    sendFriendRequest.mutate(
      { senderId, receiverId },
      {
        onSuccess: () => {
          toast({
            title: 'Success!',
            description: `You\'ve just sent friend request${toFormatName}`,
          });

          if (invalidateKey) {
            console.log('invalidate');
            utils.user[invalidateKey]
              .invalidate()
              .then(() => {
                console.log('Invalidation completed');
              })
              .catch((error) => {
                console.error('Invalidation failed:', error);
              });
          }
        },
        onError: () => {
          toast({
            variant: 'destructive',
            title: 'Error!',
            description: `Sending friend request${toFormatName} failed. Try again`,
          });
        },
      }
    );

    //   toast({
    //     title: 'Success!',
    //     description: `You\'ve just sent friend request${toFormatName}`,
    //   });

    //   if (invalidateKey) {
    //     console.log('invalidate');
    //     await utils.user[invalidateKey].invalidate();
    //   }
    // } catch (err) {
    //   console.trace(err);

    //   toast({
    //     variant: 'destructive',
    //     title: 'Error!',
    //     description: `Sending friend request${toFormatName} failed. Try again`,
    //   });
    // }
  };

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
