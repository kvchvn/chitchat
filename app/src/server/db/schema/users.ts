import { relations, sql } from 'drizzle-orm';
import { boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { accounts } from '~/server/db/schema/auth';
import { chats } from '~/server/db/schema/chats';
import { messages } from '~/server/db/schema/messages';
import { createTable } from '~/server/db/table-creator';

export const users = createTable('user', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified', {
    mode: 'date',
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar('image', { length: 255 }),
  isNewUser: boolean('is_new_user').default(true),
});

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  chats1: many(chats, { relationName: 'user_chats_1' }),
  chats2: many(chats, { relationName: 'user_chats_2' }),
  sentMessages: many(messages, { relationName: 'message_sender' }),
  receivedMessages: many(messages, { relationName: 'message_receiver' }),
}));

// TYPES

export type User = typeof users.$inferSelect;
