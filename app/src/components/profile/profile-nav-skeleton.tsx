import { calcShare } from '~/lib/utils';
import { Skeleton } from '../ui/skeleton';

type Props = {
  navItemsCount: number;
};

export const ProfileNavSkeleton = ({ navItemsCount }: Props) => {
  return (
    <>
      <Skeleton className="absolute h-10 w-10 -translate-y-[calc(100%+8px)] lg:hidden" />
      <div className="sticky top-16 flex h-fit min-w-56 flex-col gap-4 max-lg:hidden">
        {Array(navItemsCount)
          .fill(null)
          .map((_, i) => {
            const share = calcShare(i, navItemsCount);

            return (
              <div key={i} style={{ opacity: 1 - share }}>
                <Skeleton className="h-9 w-full" />
              </div>
            );
          })}
      </div>
    </>
  );
};
