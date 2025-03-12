import { Skeleton } from '~/components/ui/skeleton';

type Props = {
  count?: number;
};

export const UserItemSkeleton = ({ count }: Props = { count: 1 }) => {
  return Array(count)
    .fill(null)
    .map((_, i) => (
      <li key={i} className="border-b last:border-b-0">
        <div className="flex items-center gap-2 px-2 py-4 dark:border-b-slate-800">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex w-full min-w-32 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-9" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 min-w-24 max-w-[70%]" />
            </div>
          </div>
        </div>
      </li>
    ));
};
