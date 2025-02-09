import { TRPCError } from '@trpc/server';
import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { chats } from '~/server/db/schema/chats';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const chatsRouter = createTRPCRouter({
  getByMembersIds: protectedProcedure
    .input(z.object({ userId: z.string(), companionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [chat] = await ctx.db
        .select()
        .from(chats)
        .where(
          or(
            and(eq(chats.userId1, input.userId), eq(chats.userId2, input.companionId)),
            and(eq(chats.userId1, input.companionId), eq(chats.userId2, input.userId))
          )
        );

      if (!chat) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chat was not found',
        });
      }

      return chat;
    }),
  create: protectedProcedure
    .input(z.object({ userId: z.string(), companionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.userId || !input.companionId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Empty id/ids were passed',
        });
      }

      const [newChat] = await ctx.db
        .insert(chats)
        .values({
          userId1: input.userId,
          userId2: input.companionId,
        })
        .returning();

      return newChat;
    }),
});
