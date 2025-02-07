import { and, eq, lt } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { sessions } from '~/server/db/schema/auth';
import { users } from '~/server/db/schema/users';

// type MyEvents = Record<
//   `userInteract:${string}`,
//   (args: { type: UserInteraction; interactionFrom: string; interactionWith: string }) => void
// >;

// declare interface AppEventEmitter {
//   on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
//   off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
//   once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
//   emit<TEv extends keyof MyEvents>(event: TEv, ...args: Parameters<MyEvents[TEv]>): boolean;
// }

// class AppEventEmitter extends EventEmitter {}

// export const ee = new AppEventEmitter();

export const usersRouter = createTRPCRouter({
  // queries
  isExisting: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.select().from(users).where(eq(users.id, input.id));

      return user[0] ?? null;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const allUsers = await ctx.db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
      })
      .from(users);

    return allUsers;
  }),
  // mutations
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
  removeExpiredSessions: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const expiredSessions = await ctx.db
        .delete(sessions)
        .where(and(eq(sessions.userId, input.id), lt(sessions.expires, new Date())))
        .returning();

      return expiredSessions;
    }),
});
