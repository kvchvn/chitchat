import { cookies } from 'next/headers';
import type React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { logger } from '~/lib/logger';

const log = logger.child({ module: '(protected)/(chats)/layout.tsx' });

type Props = React.PropsWithChildren & {
  users: React.ReactNode;
  chat: React.ReactNode;
};

const RESIZABLE_GROUP_ID = 'chats';

export default function ChatsLayout({ chat, users }: Props) {
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
      <ResizablePanelGroup direction="horizontal" autoSaveId={RESIZABLE_GROUP_ID}>
        <ResizablePanel
          defaultSize={defaultResizableLayout?.[0]}
          maxSize={30}
          className="min-w-[52px]"
        >
          {users}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={defaultResizableLayout?.[1]}>
          {chat}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
