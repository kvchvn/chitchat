import { TRPCError } from '@trpc/server';
import { and, asc, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { chats } from '~/server/db/schema/chats';
import { messages } from '~/server/db/schema/messages';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const chatsRouter = createTRPCRouter({
  getByCompanionId: protectedProcedure
    .input(z.object({ companionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          chat: chats,
          messages: messages,
        })
        .from(chats)
        .where(
          or(
            and(eq(chats.userId1, ctx.session.user.id), eq(chats.userId2, input.companionId)),
            and(eq(chats.userId1, input.companionId), eq(chats.userId2, ctx.session.user.id))
          )
        )
        .leftJoin(messages, eq(chats.id, messages.chatId))
        .orderBy(asc(messages.createdAt));

      if (!result[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chat was not found',
        });
      }

      const chat = result[0].chat;
      const chatMessages = result.filter((row) => row.messages).map((row) => row.messages);

      return {
        chat,
        messages: chatMessages,
      };
    }),
  createWithCompanion: protectedProcedure
    .input(z.object({ companionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.companionId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Empty id were passed',
        });
      }

      const [newChat] = await ctx.db
        .insert(chats)
        .values({
          userId1: ctx.session.user.id,
          userId2: input.companionId,
        })
        .returning();

      return newChat;
    }),
});
