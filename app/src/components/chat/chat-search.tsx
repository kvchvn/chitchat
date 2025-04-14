'use client';

import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useStore } from '~/store/store';
import { api } from '~/trpc/react';
import { Button } from '../ui/button';
import { ChatSearchInput } from './chat-search-input';

const MIN_INDEX = 1;

export const ChatSearch = () => {
  const { isSearchOn, toggleOnSearch, toggleOffSearch, setActiveSearchMessageId, searchQuery } =
    useStore();

  const [activeIndex, setActiveIndex] = useState(MIN_INDEX);

  const companionId = useCompanionId();
  const { data: chat } = api.chats.getByCompanionId.useQuery({ companionId }, { enabled: false });

  const {
    data: foundMessages,
    isFetching,
    refetch,
    isSuccess,
  } = api.messages.getBySearch.useQuery(
    { chatId: chat?.chat.id ?? '', query: searchQuery },
    { enabled: false }
  );

  const fetchSearchResults = () => {
    void refetch().then(({ data: messages }) => {
      if (messages) {
        const newIndex = messages.length;
        const activeMessageId = messages[newIndex - 1]?.id;

        if (activeMessageId) {
          setActiveIndex(newIndex);
          setActiveSearchMessageId(activeMessageId);
        }
      }
    });
  };

  const updateActiveMessageId = (newIndex: number) => {
    if (!foundMessages) {
      return;
    }

    const activeMessageId = foundMessages[newIndex - 1]?.id;

    if (activeMessageId) {
      setActiveIndex(newIndex);
      setActiveSearchMessageId(activeMessageId);
    }
  };

  const handleIncreaseIndex = () => {
    if (!foundMessages) {
      return;
    }

    const newActiveIndex = activeIndex === foundMessages.length ? MIN_INDEX : activeIndex + 1;
    updateActiveMessageId(newActiveIndex);
  };

  const handleDecreaseIndex = () => {
    if (!foundMessages) {
      return;
    }

    const newActiveIndex = activeIndex === MIN_INDEX ? foundMessages.length : activeIndex - 1;
    updateActiveMessageId(newActiveIndex);
  };

  if (!chat) {
    return null;
  }

  if (!isSearchOn) {
    return (
      <Button
        onClick={chat ? toggleOnSearch : undefined}
        size="icon-sm"
        variant="ghost"
        className="mr-2"
        disabled={!chat.messagesMap.size}>
        <Search />
      </Button>
    );
  } else {
    return (
      <>
        <div className="ml-auto flex items-center gap-1">
          {isSuccess && (
            <span className="font-mono tracking-widest">
              {!foundMessages?.length ? '0/0' : `${activeIndex}/${foundMessages.length}`}
            </span>
          )}
          <Button
            disabled={isFetching || !foundMessages?.length}
            onClick={handleDecreaseIndex}
            size="icon-sm"
            variant="ghost"
            className="shrink-0">
            <ChevronUp />
          </Button>
          <Button
            disabled={isFetching || !foundMessages?.length}
            onClick={handleIncreaseIndex}
            size="icon-sm"
            variant="ghost"
            className="shrink-0">
            <ChevronDown />
          </Button>
          <Button onClick={toggleOffSearch} size="icon-sm" variant="outline">
            <X />
          </Button>
        </div>
        <ChatSearchInput
          areSearchResultsFetching={isFetching}
          fetchSearchResult={fetchSearchResults}
        />
      </>
    );
  }
};
