import { LoadingIcon } from '../ui/loading-icon';

export const ChatSkeleton = () => {
  return (
    // At the time is will be just Loader. Skeleton will be added later
    <div className="flex w-full grow items-center justify-center">
      <LoadingIcon className="h-12 w-12" strokeWidth={1} />
    </div>
  );
};
