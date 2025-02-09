import { relations, sql } from 'drizzle-orm';
import { boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createTable } from '../table-creator';
import { accounts } from './auth';
import { chats } from './chats';

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
  chats: many(chats),
}));
