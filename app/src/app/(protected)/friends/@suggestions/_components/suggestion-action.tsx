'use client';

import { CancelFriendRequestAction } from '~/app/(protected)/_components/actions/cancel-friend-request-action';
import { RespondToFriendRequest } from '~/app/(protected)/_components/actions/respond-to-friend-request';
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
        />
      );
    case hasSentRequest:
      return (
        <CancelFriendRequestAction
          receiverId={suggestedId}
          senderId={userId}
          receiverName={suggestedName}
        />
      );
    case hasReceivedRequest:
      return (
        <RespondToFriendRequest
          receiverId={userId}
          senderId={suggestedId}
          senderName={suggestedName}
        />
      );
  }
};
