import { TRPCError } from '@trpc/server';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const utapi = new UTApi();

export const uploadthingRouter = createTRPCRouter({
  removeFiles: protectedProcedure
    .input(z.object({ fileKeys: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const { success } = await utapi.deleteFiles(input.fileKeys);

      if (!success) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: 'Failed to remove files from uploadthing',
        });
      }

      return success;
    }),
});
