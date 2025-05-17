'use client';

import { MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { UserItemMemo } from '~/components/user/user-item';
import { useMediaQuery } from '~/hooks/use-media-query';
import { api } from '~/trpc/react';
import { Indicator } from '../ui/indicator';
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
        <Skeleton className="h-8 w-32 rounded-full lg:hidden" />
        {/* Desktop skeleton */}
        <ul className="flex flex-col max-lg:hidden">
          <UserListSkeleton count={5} />
        </ul>
      </>
    );
  }

  if (isError || !users) {
    return (
      <div className="flex h-full items-center justify-center">
        <Button
          onClick={handleClick}
          variant={isFetching ? 'default' : 'destructive'}
          size={isLessThanBreakpoint ? 'xs' : 'icon'}
          className="rounded-full">
          {isFetching ? <LoadingIcon /> : <RefreshCw />}
          {isLessThanBreakpoint && <span>{isFetching ? 'Loading' : 'Getting chats failed'}</span>}
        </Button>
      </div>
    );
  }

  const unreadMessagesTotalCount = users.reduce((sum, u) => sum + u.unreadMessagesCount, 0);

  if (isLessThanBreakpoint) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button size="xs" className="rounded-full">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Chats list</span>
            <Indicator count={unreadMessagesTotalCount} className="absolute -right-2 -top-1" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2 py-10">
          <SheetHeader className="mb-4 pl-4">
            <SheetTitle>Select a chat</SheetTitle>
          </SheetHeader>
          {isError || !users ? (
            <div className="flex h-full items-center justify-center">
              <Button onClick={handleClick} size="icon" className="rounded-full">
                {isFetching ? <LoadingIcon /> : <RefreshCw />}
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
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

  // Desktop version
  return (
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
