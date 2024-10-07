import { z } from 'zod';
import { messages } from '~/server/db/schema/message';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const messageRoute = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.messages.findMany();
  }),
  create: publicProcedure.input(z.object({ text: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.insert(messages).values({ text: input.text }).returning();
  }),
});
