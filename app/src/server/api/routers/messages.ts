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
        text: z.string().min(1),
        senderId: z.string(),
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      if (newMessage) {
        ee.emit('sendMessage', newMessage);
        ee.emit('updateChatPreview', {
          newPreviewMessage: newMessage,
          resetUnreadMessages: false,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
        });
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
            eq(messages.isRead, false),
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
  removeAllFromChat: protectedProcedure
    .input(z.object({ chatId: z.string(), userId: z.string(), companionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const removedMessages = await ctx.db
        .delete(messages)
        .where(eq(messages.chatId, input.chatId))
        .returning();

      if (removedMessages.length) {
        ee.emit('removeMessages', {
          chatId: input.chatId,
          userId: input.userId,
          companionId: input.companionId,
        });
        ee.emit('updateChatPreview', {
          newPreviewMessage: undefined,
          receiverId: input.companionId,
          senderId: input.userId,
          resetUnreadMessages: true,
        });
      }

      return removedMessages.length;
    }),
  // subscriptions
  onCreateMessage: protectedProcedure.subscription(async function* () {
    for await (const [message] of ee.toIterable('sendMessage')) {
      if (message.senderId !== message.receiverId) {
        yield message;
      }
    }
  }),
  onReadMessages: protectedProcedure.subscription(async function* () {
    for await (const [messagesIds] of ee.toIterable('readMessages')) {
      yield messagesIds;
    }
  }),
  onUpdateChatPreview: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .subscription(async function* ({ input }) {
      for await (const [data] of ee.toIterable('updateChatPreview')) {
        if (input.userId === data.receiverId || input.userId === data.senderId) {
          yield data;
        }
      }
    }),
  onRemoveMessages: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .subscription(async function* ({ input }) {
      for await (const [data] of ee.toIterable('removeMessages')) {
        if (input.userId === data.companionId) {
          yield data;
        }
      }
    }),
});
