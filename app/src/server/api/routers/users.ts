import { TRPCError } from '@trpc/server';
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
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        return undefined;
      }

      const [user] = await ctx.db.select().from(users).where(eq(users.id, input.id));

      return user;
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
      if (!input.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Empty id was passed',
        });
      }

      const [result] = await ctx.db
        .update(users)
        .set({ isNewUser: false })
        .where(eq(users.id, input.id))
        .returning({ isNewUser: users.isNewUser });

      if (!result) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: 'Unable to make user as not new',
        });
      }

      return result;
    }),
  removeExpiredSessions: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Empty id was passed',
        });
      }

      const expiredSessions = await ctx.db
        .delete(sessions)
        .where(and(eq(sessions.userId, input.id), lt(sessions.expires, new Date())))
        .returning();

      return expiredSessions;
    }),
});
