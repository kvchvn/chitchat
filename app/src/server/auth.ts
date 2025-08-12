import { DrizzleAdapter } from '@auth/drizzle-adapter';
import * as Sentry from '@sentry/nextjs';
import { and, eq, lt } from 'drizzle-orm';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';
import nodemailer from 'nodemailer';
import { ROUTES } from '~/constants/routes';

import { env } from '~/env';
import { logger } from '~/lib/logger';
import { db } from '~/server/db';
import { accounts, sessions, verificationTokens } from '~/server/db/schema/auth';
import {
  ConfirmationLinkHTMLTemplate,
  ConfirmationLinkTextTemplate,
} from './confirmation-link-templates';
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
      hasApprovedName: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    isNewUser: boolean;
    hasApprovedName: boolean;
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
        hasApprovedName: user.hasApprovedName,
      },
    }),
    async signIn({ user }) {
      try {
        // because next-auth doesn't do it for you
        const clearExpiredSessionsPromise = db
          .delete(sessions)
          .where(and(eq(sessions.userId, user.id), lt(sessions.expires, new Date())));

        const clearExpiredVerificationTokensPromise = db.delete(verificationTokens).where(
          user.email
            ? and(
                eq(verificationTokens.identifier, user.email),
                lt(verificationTokens.expires, new Date())
              )
            : // remove all expired tokens
              lt(verificationTokens.expires, new Date())
        );

        await Promise.allSettled([
          clearExpiredSessionsPromise,
          clearExpiredVerificationTokensPromise,
        ]);
      } catch (err) {
        Sentry.captureException(err, {
          level: 'error',
          user: { id: user.id, username: user.name ?? undefined },
          extra: {
            method: 'signIn',
            description: 'clearing expired sessions failed',
          },
        });
      }

      return true;
    },
  },
  pages: {
    signIn: ROUTES.signIn,
    error: ROUTES.signInError,
    newUser: ROUTES.signInUsername,
    verifyRequest: ROUTES.verifyRequest,
  },
  session: {
    // 48 hours
    maxAge: 48 * 60 * 60,
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
    EmailProvider({
      server: {
        host: env.EMAIL_HOST,
        port: Number(env.EMAIL_PORT),
        auth: {
          user: env.EMAIL_FROM,
          pass: env.GMAIL_APP_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      // 24h
      maxAge: 24 * 60 * 60,
      sendVerificationRequest: async ({ identifier, url }) => {
        const transporter = nodemailer.createTransport({
          host: env.EMAIL_HOST,
          port: Number(env.EMAIL_PORT),
          auth: {
            user: env.EMAIL_FROM,
            pass: env.GMAIL_APP_PASSWORD,
          },
        });

        try {
          const expiredIn = '24 hours';

          const res = await transporter.sendMail({
            from: env.EMAIL_FROM,
            to: identifier,
            subject: 'Sign-in confirmation link',
            attachments: [
              {
                filename: 'logo.png',
                path: './public/favicon.png',
                cid: 'favicon',
              },
            ],
            html: ConfirmationLinkHTMLTemplate({ url, expiredIn }),
            text: ConfirmationLinkTextTemplate({ url, expiredIn }),
          });

          if (res.rejected.length) {
            throw new Error(`Email(s) (${res.rejected.join(', ')}) could not be sent`);
          }
        } catch (error) {
          console.error({ error });
          Sentry.captureException(error, {
            level: 'error',
            user: { email: identifier },
            extra: {
              method: 'sendVerificationRequest',
              description: 'sending verification request (via Gmail) failed',
            },
          });
          throw error;
        }
      },
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
