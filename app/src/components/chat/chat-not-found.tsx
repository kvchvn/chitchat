import { PackageOpen } from 'lucide-react';
import { ChatContainer } from '~/components/chat/chat-container';

export const ChatNotFound = () => {
  return (
    <ChatContainer>
      <div className="flex max-w-60 flex-col items-center gap-2 text-center">
        <PackageOpen className="h-24 w-24" strokeWidth={0.5} />
        <p>
          To communicate with somebody, choose a user from the <span>sidebar</span>
        </p>
      </div>
    </ChatContainer>
  );
};
