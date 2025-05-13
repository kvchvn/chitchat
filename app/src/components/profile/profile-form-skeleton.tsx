import { Skeleton } from '../ui/skeleton';

export const ProfileFormSkeleton = () => {
  return (
    <section className="grid h-fit w-full gap-8 lg:grid-cols-2">
      <div className="relative flex flex-col gap-1 border-slate-200 pb-8 after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-1/3 after:-translate-x-1/2 after:bg-slate-200 lg:border-r lg:pb-0 lg:pr-8 lg:after:content-none">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[30%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="mt-2 h-4 w-[50%]" />
      </div>
      <div className="grid w-full grid-cols-1 gap-4">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        <Skeleton className="mt-4 h-10 w-full xs:w-[300px] xs:max-w-[50%]" />
      </div>
    </section>
  );
};
