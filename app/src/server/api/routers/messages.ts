import { TRPCError } from '@trpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { messages } from '~/server/db/schema/messages';
import { ee } from '../event-emitter';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messagesRouter = createTRPCRouter({
  // queries
  getByChatId: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.select().from(messages).where(eq(messages.chatId, input.chatId));
    }),
  // mutations
  create: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        text: z.string(),
        senderId: z.string(),
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.chatId || !input.senderId || !input.receiverId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid data were passed' });
      }

      const [newMessage] = await ctx.db
        .insert(messages)
        .values({
          chatId: input.chatId,
          text: input.text,
          senderId: input.senderId,
          receiverId: input.receiverId,
          isRead: input.senderId === input.receiverId,
        })
        .returning();

      if (newMessage && input.senderId !== input.receiverId) {
        ee.emit('sendMessage', newMessage);
      }

      return newMessage;
    }),
  readUnreadMessages: protectedProcedure
    .input(
      z.object({ senderId: z.string(), receiverId: z.string(), messagesIds: z.array(z.string()) })
    )
    .mutation(async ({ ctx, input }) => {
      const readMessages = await ctx.db
        .update(messages)
        .set({ isRead: true })
        .where(
          and(
            eq(messages.senderId, input.senderId),
            eq(messages.receiverId, input.receiverId),
            inArray(messages.id, input.messagesIds)
          )
        )
        .returning();

      const readMessagesIds = new Set<string>();

      readMessages?.forEach((message) => {
        readMessagesIds.add(message.id);
      });

      if (readMessages.length) {
        ee.emit('readMessages', readMessagesIds);
      }

      return readMessages;
    }),
  // subscriptions
  onCreateMessage: protectedProcedure.subscription(async function* () {
    for await (const [message] of ee.toIterable('sendMessage')) {
      yield message;
    }
  }),
  onReadMessages: protectedProcedure.subscription(async function* () {
    for await (const [messagesIds] of ee.toIterable('readMessages')) {
      yield messagesIds;
    }
  }),
});
