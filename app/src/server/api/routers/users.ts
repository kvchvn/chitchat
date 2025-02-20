import { TRPCError } from '@trpc/server';
import { and, desc, eq, lt, ne } from 'drizzle-orm';
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
  getAllWithTheLastMessage: protectedProcedure.query(async ({ ctx }) => {
    const youPromise = ctx.db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        image: true,
      },
      where: eq(users.id, ctx.session.user.id),
      with: {
        sentMessages: {
          columns: {
            id: true,
            createdAt: true,
            text: true,
          },
          where: eq(messages.receiverId, ctx.session.user.id),
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
        receivedMessages: {
          columns: {
            id: true,
            createdAt: true,
            text: true,
          },
          where: and(eq(messages.senderId, ctx.session.user.id)),
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
      },
    });

    const allUsersPromise = ctx.db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        image: true,
      },
      where: ne(users.id, ctx.session.user.id),
      with: {
        sentMessages: {
          columns: {
            id: true,
            createdAt: true,
            text: true,
          },
          where: eq(messages.receiverId, ctx.session.user.id),
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
        receivedMessages: {
          columns: {
            id: true,
            createdAt: true,
            text: true,
          },
          where: and(eq(messages.senderId, ctx.session.user.id)),
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
      },
    });

    const [you, allUsers] = await Promise.all([youPromise, allUsersPromise]);

    const transformedAllUsers = you.concat(allUsers).map((user) => {
      const sentMessageCreatedAt = Number(user.sentMessages?.[0]?.createdAt);
      const receivedMessageCreatedAt = Number(user.receivedMessages[0]?.createdAt);

      const lastMessage =
        sentMessageCreatedAt < receivedMessageCreatedAt
          ? user.receivedMessages[0]
          : user.sentMessages[0];
      return { id: user.id, name: user.name, image: user.image, lastMessage };
    });

    return transformedAllUsers;
  }),
  getAllWithSentUnreadMessages: protectedProcedure.query(async ({ ctx }) => {
    const usersWithMessages = await ctx.db.query.users.findMany({
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

    const usersWithMessagesRecord: Record<string, number> = {};

    for (const user of usersWithMessages) {
      usersWithMessagesRecord[user.id] = user.sentMessages.length;
    }

    return usersWithMessagesRecord;
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
