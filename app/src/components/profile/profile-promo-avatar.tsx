'use client';

import { Ban, Check, ImageUp } from 'lucide-react';
import { type ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useUpdateUserOptimisticMutation } from '~/hooks/mutations/use-update-user-optimistic-mutation';
import { useUploadThing } from '~/hooks/uploadthing';
import { useToast } from '~/hooks/use-toast';
import { cn, getNameInitials } from '~/lib/utils';
import { api } from '~/trpc/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LoadingIcon } from '../ui/loading-icon';

export const ProfilePromoAvatar = () => {
  const TIMEOUT_MS = 3000;
  const [isResult, setIsResult] = useState<'success' | 'error' | null>(null);
  const { data: user } = api.users.getCurrent.useQuery();
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { mutateAsync: updateUser, isPending: isPendingUpdateUser } =
    useUpdateUserOptimisticMutation();
  const { mutateAsync: removeFiles, isPending: isPendingRemoveFiles } =
    api.uploadthing.removeFiles.useMutation();

  const { isUploading, startUpload } = useUploadThing('avatarUploader', {
    signal: abortControllerRef.current?.signal,
    onUploadError: () => {
      abortControllerRef.current = null;

      toast({
        variant: 'destructive',
        title: 'Updating the avatar failed',
        description:
          'Unable to upload your image. Choose another image (less than 1 MB) or try again later',
      });
    },
    onClientUploadComplete: async (files) => {
      abortControllerRef.current = null;
      const file = files[0];
      const prevFileKey = user?.fileKey;

      if (file) {
        try {
          await updateUser({ image: file.ufsUrl, fileKey: file.key });
          if (prevFileKey) {
            // remove previous avatar if it has been saved on uploadthing
            await removeFiles({ fileKeys: [prevFileKey] });
          }

          setIsResult('success');
        } catch {
          const fileKeys = files.map((f) => f.key);
          // remove the file if its url hasn't been saved in the database
          await removeFiles({ fileKeys });

          setIsResult('error');
        } finally {
          setTimeout(() => {
            setIsResult(null);
          }, TIMEOUT_MS);
        }
      }
    },
  });

  const nameInitials = getNameInitials(user?.name);

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files) {
      abortControllerRef.current = new AbortController();
      const files = Array.from(e.target.files);
      await startUpload(files);
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const isProcessing = isUploading || isPendingUpdateUser || isPendingRemoveFiles;
  const isDelay = Boolean(isProcessing || isResult);

  const ResultIcon = isResult === 'success' ? Check : Ban;
  const ProcessingIcon = isProcessing ? LoadingIcon : ImageUp;
  const Icon = isResult ? ResultIcon : ProcessingIcon;

  return (
    <Avatar className="group absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 translate-y-1/2 border-8 border-background-light dark:border-background-dark lg:left-[unset] lg:h-36 lg:w-36 lg:translate-x-0 lg:translate-y-8">
      <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'Avatar'} />
      <AvatarFallback className="text-4xl tracking-wider">{nameInitials}</AvatarFallback>
      <span
        className={cn(
          'absolute h-full w-full transition-[backdrop-filter] duration-200 lg:group-hover:backdrop-blur-md',
          isDelay && 'backdrop-blur-md'
        )}>
        <label
          className={cn(
            'absolute left-0 top-3/4 z-2 h-1/2 w-full cursor-pointer bg-slate-300 backdrop-blur-lg transition-[top,background-color] group-hover:animate-none group-hover:duration-300 dark:bg-slate-800 lg:top-full lg:animate-avatar-upload-btn-bounce lg:backdrop-blur-none lg:hover:bg-slate-400 lg:group-hover:top-1/2 lg:dark:hover:bg-slate-700',
            isDelay &&
              'top-1/2 animate-none cursor-default bg-slate-400 dark:bg-slate-700 lg:top-1/2 lg:animate-none lg:bg-slate-400 lg:dark:bg-slate-700'
          )}>
          <input disabled={isDelay} onChange={handleChange} type="file" hidden />
          <span
            className={cn(
              'absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-8 scale-75 transition-[transform] lg:h-6 lg:w-6 lg:group-hover:-translate-y-1/2 lg:group-hover:scale-100',
              isDelay && '-translate-y-1/2 scale-100'
            )}>
            <Icon className="h-full w-full" />
          </span>
        </label>
      </span>
    </Avatar>
  );
};
