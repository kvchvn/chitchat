import { ChatContainer } from '~/components/chat/chat-container';
import { Button } from '~/components/ui/button';

export function ChatIsNotCreated() {
  return (
    <ChatContainer>
      <div className="max-w-100 flex flex-col items-center gap-2 text-center">
        <h3>Chat is not created yet.</h3>
        <p>But you can do it easily. Just click the button below.</p>
        <Button className="mt-4">Start chatting</Button>
      </div>
    </ChatContainer>
  );
}
