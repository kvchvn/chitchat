import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { chats } from '~/server/db/schema/chats';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const chatsRouter = createTRPCRouter({
  getByMembersIds: protectedProcedure
    .input(z.object({ userId: z.string(), companionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db
        .select()
        .from(chats)
        .where(
          or(
            and(eq(chats.userId1, input.userId), eq(chats.userId2, input.companionId)),
            and(eq(chats.userId1, input.companionId), eq(chats.userId2, input.userId))
          )
        );

      return chat[0] ?? null;
    }),
});
