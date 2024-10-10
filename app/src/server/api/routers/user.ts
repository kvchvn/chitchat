import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from '~/server/db/schema/auth';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  // getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
  //   const existingUser = await ctx.db.query.users.findFirst({
  //     where: eq(users.id, input.id),
  //   });

  //   return existingUser ?? null;
  // }),
  makeAsNotNew: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(users)
        .set({ isNewUser: false })
        .where(eq(users.id, input.id))
        .returning({ isNewUser: users.isNewUser });

      return result[0] ?? null;
    }),
});
