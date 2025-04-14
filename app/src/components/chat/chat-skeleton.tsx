import { cn } from '~/lib/utils';
import { Skeleton } from '../ui/skeleton';

const MESSAGES_COUNT = 7;

export const ChatSkeleton = () => {
  return (
    <>
      <div className="mt-2 w-[calc(100%+8px)] grow overflow-hidden pr-[8px]">
        <div className="flex min-h-full w-full flex-col justify-end pt-10">
          <Skeleton className="mx-auto h-[21px] w-24 rounded-3xl" />
          <ul className="flex shrink-0 flex-col justify-end gap-2 overflow-y-auto px-1 py-8">
            {Array(MESSAGES_COUNT)
              .fill(null)
              .map((_, i) => (
                <li
                  key={i}
                  className={cn('flex w-full items-end justify-end', {
                    'self-message self-end': i % 3 === 0,
                    'companion-message flex-row-reverse': i % 3 !== 0,
                  })}>
                  <Skeleton className={`h-[58px] w-40 min-w-24 max-w-[80%] rounded-3xl`} />
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto flex w-full gap-4 border-t border-slate-300 pt-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      </div>
    </>
  );
};
