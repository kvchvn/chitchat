import React from 'react';
import { type ChatMessage } from '~/server/db/schema/messages';
import { useUserId } from '../contexts/user-id-provider';
import { CopyMessageDropdownItem } from './copy-message-dropdown-item';
import { EditMessageDropdownItem } from './edit-message-dropdown-item';
import { LikeMessageDropdownItem } from './like-message-dropdown-item';
import { RemoveMessageDropdownItem } from './remove-message-dropdown-item';

type Props = {
  message: ChatMessage;
};

export const MessageSettingsDropdownItems: React.FC<Props> = ({ message }) => {
  const userId = useUserId();

  return (
    <>
      {message.senderId === userId ? (
        <>
          <EditMessageDropdownItem message={message} />
          <RemoveMessageDropdownItem message={message} />
        </>
      ) : (
        // It's no need to like messages by the sender
        <LikeMessageDropdownItem message={message} />
      )}
      <CopyMessageDropdownItem text={message.text} />
    </>
  );
};
