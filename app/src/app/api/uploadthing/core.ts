import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { logger } from '~/lib/logger';
import { getServerAuthSession } from '~/server/auth';

const f = createUploadthing();
const log = logger.child({ module: 'uploadthing/core' });

export const uploadRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerAuthSession();

      if (!session) {
        throw new UploadThingError('UNAUTHORIZED');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      // This code RUNS ON THE SERVER after upload
      log.info('Upload avatar complete for userId:', metadata.userId);

      // Whatever is returned here is sent to the client-side `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
