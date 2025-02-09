import { LoadingIcon } from '../ui/loading-icon';
import { ChatContainer } from './chat-container';

export const ChatSkeleton = () => {
  return (
    // At the time is will be just Loader. Skeleton will be added later
    <ChatContainer>
      <LoadingIcon className="h-12 w-12" strokeWidth={1} />
    </ChatContainer>
  );
};
