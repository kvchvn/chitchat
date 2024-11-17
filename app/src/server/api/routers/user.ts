import { and, eq, lt, ne, sql } from 'drizzle-orm';
import { except } from 'drizzle-orm/pg-core';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { sessions, users } from '~/server/db/schema/auth';
import { friendRequests, friends } from '~/server/db/schema/friends';

// interface MyEvents {
//   friendRequest: (args: {
//     type: 'incoming' | 'outcoming';
//     senderId: string;
//     receiverId: string;
//   }) => void;
//   isTypingUpdate: () => void;
// }

// declare interface MyEventEmitter {
//   on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
//   off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
//   once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
//   emit<TEv extends keyof MyEvents>(event: TEv, ...args: Parameters<MyEvents[TEv]>): boolean;
// }

// class MyEventEmitter extends EventEmitter {
//   public toIterable<TEv extends keyof MyEvents>(
//     event: TEv
//   ): AsyncIterable<Parameters<MyEvents[TEv]>> {
//     return on(this, event);
//   }
// }

// export const ee = new MyEventEmitter();

export const userRouter = createTRPCRouter({
  greeting: publicProcedure.input(z.object({ text: z.string() })).mutation(async ({ input }) => {
    return `Hello ${input.text}!`;
  }),
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
  getSuggestedUsers: protectedProcedure
    .input(z.object({ id: z.string(), limit: z.number(), offset: z.number() }))
    .query(async ({ ctx, input }) => {
      const allUsersExceptCurrent = ctx.db
        .select({
          id: users.id,
          name: users.name,
          image: users.image,
          hasReceivedRequest: sql<boolean>`EXISTS (SELECT 1 FROM ${friendRequests} WHERE ${friendRequests.senderId} = ${users.id} AND ${friendRequests.receiverId} = ${input.id})`,
          hasSentRequest: sql<boolean>`EXISTS (SELECT 1 FROM ${friendRequests} WHERE ${friendRequests.senderId} = ${input.id} AND ${friendRequests.receiverId} = ${users.id})`,
        })
        .from(users)
        .where(ne(users.id, input.id));

      const userFriends = ctx.db
        .select({
          id: friends.friendId,
          name: users.name,
          image: users.image,
          hasReceivedRequest: sql<boolean>`EXISTS (SELECT 1 FROM ${friendRequests} WHERE ${friendRequests.senderId} = ${users.id} AND ${friendRequests.receiverId} = ${input.id})`,
          hasSentRequest: sql<boolean>`EXISTS (SELECT 1 FROM ${friendRequests} WHERE ${friendRequests.senderId} = ${input.id} AND ${friendRequests.receiverId} = ${users.id})`,
        })
        .from(friends)
        .where(eq(friends.userId, input.id))
        .leftJoin(users, eq(users.id, friends.friendId));

      return await except(allUsersExceptCurrent, userFriends);
    }),
  getUserFriends: protectedProcedure
    .input(z.object({ id: z.string(), limit: z.number(), offset: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: friends.friendId,
          name: users.name,
          image: users.image,
        })
        .from(friends)
        .where(eq(friends.userId, input.id))
        .leftJoin(users, eq(users.id, friends.friendId))
        .offset(input.offset)
        .limit(input.limit);
    }),
  getUserIncomingFriendRequests: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          sender: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(friendRequests)
        .where(eq(friendRequests.receiverId, input.id))
        .leftJoin(users, eq(users.id, friendRequests.senderId));
    }),
  getUserOutcomingFriendRequests: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          receiver: {
            id: users.id,
            name: users.name,
            image: users.image,
          },
        })
        .from(friendRequests)
        .where(eq(friendRequests.senderId, input.id))
        .leftJoin(users, eq(users.id, friendRequests.receiverId));
    }),
  sendFriendRequest: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // create new friend request
      const newRequest = await ctx.db
        .insert(friendRequests)
        .values({
          senderId: input.senderId,
          receiverId: input.receiverId,
        })
        .returning();

      return newRequest[0] ?? null;

      // ee.emit('friendRequest', {
      //   type: 'outcoming',
      //   senderId: input.senderId,
      //   receiverId: input.receiverId,
      // });
    }),
  cancelFriendRequest: protectedProcedure
    .input(z.object({ senderId: z.string(), receiverId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(friendRequests)
        .where(
          and(
            eq(friendRequests.senderId, input.senderId),
            eq(friendRequests.receiverId, input.receiverId)
          )
        );
    }),
  respondToFriendRequest: protectedProcedure
    .input(z.object({ requestId: z.string(), response: z.enum(['accept', 'decline']) }))
    .mutation(async ({ ctx, input }) => {
      // remove current friend request
      const requests = await ctx.db
        .delete(friendRequests)
        .where(eq(friendRequests.id, input.requestId))
        .returning();

      const request = requests[0];

      if (input.response === 'accept' && request) {
        // make users as friends
        await Promise.all([
          ctx.db.insert(friends).values({
            userId: request.senderId,
            friendId: request.receiverId,
          }),
          ctx.db.insert(friends).values({
            friendId: request.senderId,
            userId: request.receiverId,
          }),
        ]);
      }
    }),
  // onFriendRequest: publicProcedure.subscription(async function* () {
  //   for await (const [data] of ee.toIterable('friendRequest')) {
  //     yield data;
  //   }
  // }),
});
