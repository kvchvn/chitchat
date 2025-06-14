import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import type React from 'react';
import { UserIdProvider } from '~/components/contexts/user-id-provider';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { UsersList } from '~/components/user/users-list';
import { ROUTES } from '~/constants/routes';
import { logger } from '~/lib/logger';
import { getServerAuthSession } from '~/server/auth';

const log = logger.child({ module: '(protected)/(chats)/layout.tsx' });

const RESIZABLE_GROUP_ID = 'chats';
const SIDEBAR_SIZE_PERCENT = 30;

export default async function ChatsLayout({ children }: React.PropsWithChildren) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(ROUTES.signIn, RedirectType.replace);
  }

  const resizableLayout = cookies().get(`react-resizable-panels:${RESIZABLE_GROUP_ID}`);
  let defaultResizableLayout: number[] | undefined = undefined;

  if (resizableLayout) {
    try {
      const value: unknown = JSON.parse(resizableLayout.value);

      if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
        defaultResizableLayout = value;
      }
    } catch (err) {
      log.error(err);
    }
  }

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId={RESIZABLE_GROUP_ID}
        className="max-h-[calc(100dvh-4.5rem)] p-[2px] pt-2 lg:pt-6">
        <ResizablePanel
          defaultSize={defaultResizableLayout?.[0] ?? SIDEBAR_SIZE_PERCENT}
          maxSize={SIDEBAR_SIZE_PERCENT}
          className="max-lg:fixed max-lg:top-2 max-lg:z-3 max-lg:h-8 max-lg:!overflow-visible lg:min-w-14 lg:max-w-none">
          <UserIdProvider userId={session.user.id}>
            <UsersList />
          </UserIdProvider>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden lg:flex" />
        <ResizablePanel
          defaultSize={defaultResizableLayout?.[1] ?? 100 - SIDEBAR_SIZE_PERCENT}
          className="p-[3px]">
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
