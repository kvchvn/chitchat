import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { messages } from '~/server/db/schema/messages';
import { ee } from '../event-emitter';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messagesRouter = createTRPCRouter({
  getByChatId: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.select().from(messages).where(eq(messages.chatId, input.chatId));
    }),
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
        })
        .returning();

      if (newMessage) {
        ee.emit('sendMessage', newMessage);
      }

      return newMessage;
    }),
  onCreateMessage: protectedProcedure.subscription(async function* () {
    for await (const [message] of ee.toIterable('sendMessage')) {
      yield message;
    }
  }),
});
