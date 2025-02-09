'use client';
import * as ResizablePrimitive from 'react-resizable-panels';

import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { cn } from '~/lib/utils';

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => {
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:${props.autoSaveId}=${JSON.stringify(sizes)}`;
  };

  return (
    <ResizablePrimitive.PanelGroup
      onLayout={onLayout}
      className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
      {...props}
    />
  );
};

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'relative flex w-px items-center justify-center bg-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[resize-handle-state=drag]:bg-sky-700 data-[resize-handle-state=hover]:bg-sky-500 dark:bg-slate-400 dark:focus-visible:ring-neutral-300 dark:data-[resize-handle-state=drag]:bg-sky-700 dark:data-[resize-handle-state=hover]:bg-sky-500 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
