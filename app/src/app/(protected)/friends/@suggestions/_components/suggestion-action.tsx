'use client';

import { AcceptFriendRequestAction } from '~/app/(protected)/_components/actions/accept-friend-request-action';
import { CancelFriendRequestAction } from '~/app/(protected)/_components/actions/cancel-friend-request-action';
import { RejectFriendRequestAction } from '~/app/(protected)/_components/actions/reject-friend-request-action';
import { SendFriendRequestAction } from '~/app/(protected)/_components/actions/send-friend-request-action';

type Props = {
  suggestedId: string;
  userId: string;
  suggestedName: string | null;
  hasSentRequest: boolean;
  hasReceivedRequest: boolean;
};

export const SuggestionAction = ({
  suggestedId,
  userId,
  hasSentRequest,
  hasReceivedRequest,
  suggestedName,
}: Props) => {
  switch (true) {
    case !hasReceivedRequest && !hasSentRequest:
      return (
        <SendFriendRequestAction
          receiverId={suggestedId}
          senderId={userId}
          receiverName={suggestedName}
          invalidateKey="getSuggestedUsers"
        />
      );
    case hasSentRequest:
      return (
        <CancelFriendRequestAction
          receiverId={suggestedId}
          senderId={userId}
          receiverName={suggestedName}
          invalidateKey="getSuggestedUsers"
        />
      );
    case hasReceivedRequest:
      return (
        <>
          <AcceptFriendRequestAction
            receiverId={userId}
            senderId={suggestedId}
            senderName={suggestedName}
            invalidateKey="getSuggestedUsers"
          />
          <RejectFriendRequestAction
            receiverId={userId}
            senderId={suggestedId}
            senderName={suggestedName}
            invalidateKey="getSuggestedUsers"
          />
        </>
      );
  }
};
