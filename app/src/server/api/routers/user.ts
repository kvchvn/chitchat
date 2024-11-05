import { and, eq, lt, ne } from 'drizzle-orm';
import { z } from 'zod';
import { sessions, users } from '~/server/db/schema/auth';
import { friendRequests } from '~/server/db/schema/friends';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

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
  removeExpiredSessions: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const expiredSessions = await ctx.db
        .delete(sessions)
        .where(and(eq(sessions.userId, input.id), lt(sessions.expires, new Date())))
        .returning();

      return expiredSessions;
    }),
  getAllUsersExceptCurrent: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const allUsers = await ctx.db.query.users.findMany({ where: ne(users.id, input.id) });

      return allUsers;
    }),
  getUserFriends: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        with: {
          friends1: true,
        },
      });

      const userFriendsPromises = user?.friends1.map(async (friendship) => {
        const friendId = input.id === friendship.user1Id ? friendship.user2Id : friendship.user1Id;
        return await ctx.db.query.users.findFirst({
          where: eq(users.id, friendId),
          columns: {
            id: true,
            name: true,
            image: true,
          },
        });
      });

      if (userFriendsPromises) {
        return Promise.allSettled(userFriendsPromises);
      } else {
        return null;
      }
    }),
  getUserIncomingFriendRequests: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const requests = await ctx.db
        .select({
          sender: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
          status: friendRequests.status,
        })
        .from(friendRequests)
        .where(eq(friendRequests.receiverId, input.id))
        .leftJoin(users, eq(users.id, friendRequests.senderId));

      return requests;
    }),
  getUserOutcomingFriendRequests: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const requests = await ctx.db
        .select({
          receiver: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
          status: friendRequests.status,
        })
        .from(friendRequests)
        .where(eq(friendRequests.senderId, input.id))
        .leftJoin(users, eq(users.id, friendRequests.receiverId));

      return requests;
    }),
});
