import { TRPCError } from '@trpc/server';
import { and, desc, eq, lt } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { sessions } from '~/server/db/schema/auth';
import { messages } from '~/server/db/schema/messages';
import { users } from '~/server/db/schema/users';

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
  getAllWithChatPreview: protectedProcedure.query(async ({ ctx }) => {
    // get all users with the last message in the chat between a user and current user
    const allUsersPromise = ctx.db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        image: true,
      },
      with: {
        sentMessages: {
          where: eq(messages.receiverId, ctx.session.user.id),
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
        receivedMessages: {
          where: and(eq(messages.senderId, ctx.session.user.id)),
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
      },
    });

    // get all users with a count of unread messages that has been sent by a user to current user
    const allUsersWithUnreadSentMessagesPromise = ctx.db.query.users.findMany({
      columns: {
        id: true,
      },
      with: {
        sentMessages: {
          columns: {
            id: true,
          },
          where: and(eq(messages.receiverId, ctx.session.user.id), eq(messages.isRead, false)),
        },
      },
    });

    const [allUsers, allUsersWithUnreadSentMessages] = await Promise.all([
      allUsersPromise,
      allUsersWithUnreadSentMessagesPromise,
    ]);

    const allUsersWithUnreadSentMessagesCount: Record<string, number> = {};

    // loop through the array to save count values as properties. Id is a key
    allUsersWithUnreadSentMessages.forEach((u) => {
      allUsersWithUnreadSentMessagesCount[u.id] = u.sentMessages.length;
    });

    // replace current user's chat at the beginning (it will be a kind of "notes")
    const currentUserIndex = allUsers.findIndex((u) => u.id === ctx.session.user.id);
    let sortedAllUsers = allUsers;

    if (allUsers[currentUserIndex]) {
      sortedAllUsers = [allUsers[currentUserIndex]].concat(
        allUsers.slice(0, currentUserIndex),
        allUsers.slice(currentUserIndex + 1)
      );
    }

    // search for the last message in a chat
    const transformedAllUsers = sortedAllUsers.map((u) => {
      const sentMessageCreatedAt = Number(u.sentMessages?.[0]?.createdAt);
      const receivedMessageCreatedAt = Number(u.receivedMessages[0]?.createdAt);

      const lastMessage =
        sentMessageCreatedAt < receivedMessageCreatedAt ? u.receivedMessages[0] : u.sentMessages[0];

      const unreadMessagesCount = allUsersWithUnreadSentMessagesCount[u.id] ?? 0;
      return { id: u.id, name: u.name, image: u.image, lastMessage, unreadMessagesCount };
    });

    return transformedAllUsers;
  }),
  // mutations
  makeAsNotNew: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
      const expiredSessions = await ctx.db
        .delete(sessions)
        .where(and(eq(sessions.userId, input.id), lt(sessions.expires, new Date())))
        .returning();

      return expiredSessions;
    }),
});
