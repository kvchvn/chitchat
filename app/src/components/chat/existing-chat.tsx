import { Fragment, useCallback, useEffect, useRef } from 'react';
import { ChatBlock } from '~/components/chat/chat-block';
import { ChatForm } from '~/components/chat/chat-form';
import { useUserId } from '~/components/contexts/user-id-provider';
import { MessageContainer } from '~/components/message/message-container';
import { MessageStatusBar } from '~/components/message/message-status-bar';
import { MessageStatusIcon } from '~/components/message/message-status-icon';
import { MessageTime } from '~/components/message/message-time';
import { useBlockUserSubscription } from '~/hooks/use-block-user-subscription';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useNewMessagesSubscription } from '~/hooks/use-new-messages-subscription';
import { useNewReadMessagesSubscription } from '~/hooks/use-new-read-messages-subscription';
import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';

type Props = {
  messagesMap: Map<string, ChatMessage[]>;
  blockedBy: string | null;
};

export const ExistingChat = ({ messagesMap, blockedBy }: Props) => {
  const messagesEntries = Array.from(messagesMap);
  const todaysMessages = messagesEntries.at(-1)?.[1];

  const userId = useUserId();
  const companionId = useCompanionId();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstUnreadMessageRef = useRef<HTMLLIElement | null>(null);
  const unreadMessages = useRef<Set<string>>(new Set([]));
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const bottomOfContainerRef = useRef<HTMLElement | null>(null);

  const { mutate: readUnreadMessages } = api.messages.readUnreadMessages.useMutation();

  useNewMessagesSubscription();
  useNewReadMessagesSubscription({ companionId });
  useBlockUserSubscription();

  const onReadMessages = useCallback(() => {
    if (unreadMessages.current.size) {
      readUnreadMessages({
        senderId: companionId,
        receiverId: userId,
        messagesIds: Array.from(unreadMessages.current),
      });
    }
  }, [userId, companionId, readUnreadMessages]);

  const handleScroll = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      onReadMessages();
      unreadMessages.current.clear();
    }, 1000);
  };

  const onSendMessageSideEffect = () => {
    firstUnreadMessageRef.current = null;
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const containerOffset =
      containerRef.current.scrollHeight -
      (containerRef.current.scrollTop + containerRef.current.clientHeight);

    // scroll to the bottom when send a message
    // the latest (by date) array of messages. And the latest message in there
    if (todaysMessages?.at(-1)?.senderId === userId || containerOffset < 200) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [todaysMessages?.length, userId]);

  useEffect(() => {
    // initial scroll to the freshest unread message or to the bottom of the chat
    const container = containerRef.current;
    const message = firstUnreadMessageRef.current;

    if (container) {
      if (message) {
        container.scrollTo({ top: message.offsetTop - message.offsetHeight - 100 });
      } else {
        container.scrollTo({ top: container.scrollHeight });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // such way I get the freshest unreadMessages ref
    const timerId = setTimeout(() => {
      onReadMessages();
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [onReadMessages, todaysMessages?.length]);

  return (
    <>
      {messagesMap.size ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative mb-4 mt-2 w-[calc(100%+8px)] grow overflow-y-auto pr-[8px] pt-10 scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px]">
          {messagesEntries.map(([date, messages]) => (
            <Fragment key={date}>
              <span className="mx-auto block w-fit rounded-3xl bg-accent-light px-3 py-1 font-mono text-xs dark:bg-accent-dark">
                {date}
              </span>
              <ul className="flex flex-col justify-end gap-2 overflow-y-auto px-1 py-8">
                {messages.map((message) => (
                  <MessageContainer
                    key={message.id}
                    messageId={message.id}
                    fromCurrentUser={userId === message.senderId}
                    isRead={message.isRead}
                    unreadMessages={unreadMessages.current}
                    ref={firstUnreadMessageRef}>
                    <span className="px-5">{message.text}</span>
                    <MessageStatusBar fromCurrentUser={userId === message.senderId}>
                      <MessageTime createdAt={message.createdAt} />
                      {userId === message.senderId ? (
                        <MessageStatusIcon isRead={message.isRead} isSent={message.isSent} />
                      ) : null}
                    </MessageStatusBar>
                  </MessageContainer>
                ))}
              </ul>
            </Fragment>
          ))}
          <span ref={bottomOfContainerRef} />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-gray-dark dark:text-gray-light">There are no messages yet...</span>
        </div>
      )}
      {blockedBy ? (
        <ChatBlock byCurrentUser={blockedBy === userId} />
      ) : (
        <ChatForm onSubmitSideEffect={onSendMessageSideEffect} />
      )}
    </>
  );
};
