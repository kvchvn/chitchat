import { ChatContainer } from '~/components/chat/chat-container';

export const ChatNotFound = () => {
  return (
    <ChatContainer>
      <div className="flex max-w-60 flex-col gap-2 text-center">
        <h3>Chat is not found!</h3>
        <p>
          To communicate with somebody, choose a user from the <span>sidebar</span>
        </p>
      </div>
    </ChatContainer>
  );
};
