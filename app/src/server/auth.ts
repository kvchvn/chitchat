import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { and, eq, lt } from 'drizzle-orm';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';
import { ROUTES } from '~/constants/routes';

import { env } from '~/env';
import { logger } from '~/lib/logger';
import { db } from '~/server/db';
import { accounts, sessions, verificationTokens } from '~/server/db/schema/auth';
import { users } from './db/schema/users';

const log = logger.child({ module: 'auth.ts' });

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isNewUser: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    isNewUser: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        isNewUser: user.isNewUser,
      },
    }),
    async signIn({ user }) {
      try {
        // because next-auth doesn't do it for you
        const expiredSessions = await db
          .delete(sessions)
          .where(and(eq(sessions.userId, user.id), lt(sessions.expires, new Date())))
          .returning();
        log.info({ expiredSessions }, `${expiredSessions.length} sessions were cleared`);
      } catch (err) {
        log.error(err);
      }

      return true;
    },
  },
  pages: {
    signIn: ROUTES.signIn,
    error: ROUTES.signInError,
    newUser: ROUTES.signInWelcome,
  },
  session: {
    // 12 hours
    maxAge: 12 * 60 * 60,
    // 1 hour
    updateAge: 60 * 60,
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    YandexProvider({
      clientId: env.YANDEX_ID,
      clientSecret: env.YANDEX_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_ID,
      clientSecret: env.FACEBOOK_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
