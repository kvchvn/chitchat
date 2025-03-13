import { TRPCError } from '@trpc/server';
import { and, asc, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { generateChatDateKey } from '~/lib/utils';
import { ee } from '~/server/api/event-emitter';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { chats } from '~/server/db/schema/chats';
import { type ChatMessage, messages } from '~/server/db/schema/messages';

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

      const messagesMap = new Map<string, ChatMessage[]>();

      const chat = result[0].chat;
      const chatMessages = result.map((row) => row.messages);

      chatMessages.forEach((message) => {
        if (!message) {
          return;
        }

        const dateKey = generateChatDateKey(message.createdAt);

        if (!messagesMap.has(dateKey)) {
          messagesMap.set(dateKey, []);
        }

        messagesMap.get(dateKey)?.push(message);
      });

      return {
        chat,
        messagesMap,
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
  toggleBlocking: protectedProcedure
    .input(z.object({ chatId: z.string(), blockedUserId: z.string(), block: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (input.blockedUserId === ctx.session.user.id) {
        return null;
      }

      const [updatedChat] = await ctx.db
        .update(chats)
        .set({
          blockedBy: input.block ? ctx.session.user.id : null,
        })
        .where(eq(chats.id, input.chatId))
        .returning();

      if (updatedChat) {
        ee.emit('updateChatPreview', {
          senderId: ctx.session.user.id,
          receiverId: input.blockedUserId,
          isBlocked: input.block,
        });
        ee.emit('toggleBlockChat', {
          initiatorId: ctx.session.user.id,
          blockedUserId: input.blockedUserId,
          block: input.block,
        });
      }

      return updatedChat;
    }),
  // subscriptions
  onToggleBlocking: protectedProcedure.subscription(async function* ({ ctx }) {
    for await (const [data] of ee.toIterable('toggleBlockChat')) {
      if (ctx.session.user.id === data.blockedUserId) {
        yield data;
      }
    }
  }),
});
