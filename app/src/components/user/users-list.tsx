'use client';

import { MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { UserItemMemo } from '~/components/user/user-item';
import { useMediaQuery } from '~/hooks/use-media-query';
import { api } from '~/trpc/react';
import { LoadingIcon } from '../ui/loading-icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Skeleton } from '../ui/skeleton';
import { UserListSkeleton } from './user-list-skeleton';

export const UsersList = () => {
  const {
    isLoading,
    isFetching,
    isError,
    data: users,
    refetch,
  } = api.users.getAllWithChatPreview.useQuery(undefined, { retry: false });

  const { isLessThanBreakpoint } = useMediaQuery('lg');

  const handleClick = () => {
    void refetch();
  };

  if (isLoading) {
    return (
      <>
        {/* Mobile skeleton */}
        <Skeleton className="h-10 w-10 rounded-full md:mt-3 lg:hidden" />
        {/* Desktop skeleton */}
        <ul className="flex flex-col max-lg:hidden">
          <UserListSkeleton count={5} />
        </ul>
      </>
    );
  }

  if (isLessThanBreakpoint) {
    return (
      <Sheet>
        <SheetTrigger className="md:mt-3" asChild>
          <Button className="rounded-full md:w-10 md:p-0">
            <MessageCircle />
            <span className="md:hidden">Chats list</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-4 py-10">
          <SheetHeader className="mb-4">
            <SheetTitle>Select a chat</SheetTitle>
          </SheetHeader>
          {isError || !users ? (
            <div className="flex h-full items-center justify-center">
              <Button onClick={handleClick} size="icon" className="rounded-full">
                {isFetching ? <LoadingIcon /> : <RefreshCw />}
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col">
              {users.map((user) => (
                <UserItemMemo
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  image={user.image}
                  lastMessage={user.lastMessage}
                  unreadMessagesCount={user.unreadMessagesCount}
                  isBlocked={Boolean(user.chat?.blockedBy)}
                />
              ))}
            </ul>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  return isError || !users ? (
    <div className="flex h-full items-center justify-center">
      <Button onClick={handleClick} size="icon" className="rounded-full">
        {isFetching ? <LoadingIcon /> : <RefreshCw />}
      </Button>
    </div>
  ) : (
    <ul className="flex flex-col">
      {users.map((user) => (
        <UserItemMemo
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          lastMessage={user.lastMessage}
          unreadMessagesCount={user.unreadMessagesCount}
          isBlocked={Boolean(user.chat?.blockedBy)}
        />
      ))}
    </ul>
  );
};
