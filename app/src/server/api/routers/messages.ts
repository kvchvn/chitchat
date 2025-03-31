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
        ee.emit('event', {
          action: 'onSendMessage',
          eventReceiverId: newMessage.receiverId,
          data: {
            newMessage,
          },
        });

        ee.emit('event', {
          action: 'onUpdateChatPreview',
          eventReceiverId: newMessage.receiverId,
          data: {
            chatWithId: newMessage.senderId,
            previewMessage: newMessage,
            unreadMessagesDiff: 1,
          },
        });
      }

      return newMessage;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        newText: z.string().min(1),
        dateKey: z.string(),
        receiverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updatedMessage] = await ctx.db
        .update(messages)
        .set({ text: input.newText, updatedAt: new Date() })
        .where(eq(messages.id, input.id))
        .returning();

      if (updatedMessage) {
        ee.emit('event', {
          action: 'onEditMessage',
          eventReceiverId: updatedMessage.receiverId,
          data: {
            updatedMessage,
          },
        });

        ee.emit('event', {
          action: 'onUpdateChatPreview',
          eventReceiverId: updatedMessage.receiverId,
          data: {
            chatWithId: updatedMessage.senderId,
            previewMessage: updatedMessage,
            // the rest params will leave the same
          },
        });
      }

      return updatedMessage;
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

      if (readMessages.length) {
        ee.emit('event', {
          action: 'onReadMessages',
          eventReceiverId: input.senderId,
          data: {
            readMessages,
          },
        });
      }

      return readMessages;
    }),
  clearAllFromChat: protectedProcedure
    .input(z.object({ chatId: z.string(), companionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const removedMessages = await ctx.db
        .delete(messages)
        .where(eq(messages.chatId, input.chatId))
        .returning();

      if (removedMessages.length) {
        ee.emit('event', {
          action: 'onClearChat',
          eventReceiverId: input.companionId,
          data: {
            clearedById: ctx.session.user.id,
          },
        });

        ee.emit('event', {
          action: 'onUpdateChatPreview',
          eventReceiverId: input.companionId,
          data: {
            chatWithId: ctx.session.user.id,
            previewMessage: null,
            unreadMessagesDiff: 0,
          },
        });
      }

      return removedMessages.length;
    }),
});
