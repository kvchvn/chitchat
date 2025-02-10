import { relations } from 'drizzle-orm';
import { varchar } from 'drizzle-orm/pg-core';
import { createTable } from '../table-creator';
import { messages } from './messages';
import { users } from './users';

export const chats = createTable('chats', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId1: varchar('user_id_1', { length: 255 })
    .notNull()
    .references(() => users.id),
  userId2: varchar('user_id_2', { length: 255 })
    .notNull()
    .references(() => users.id),
});

// RELATIONS

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user1: one(users, {
    fields: [chats.userId1],
    references: [users.id],
    relationName: 'user1_in_chats',
  }),
  user2: one(users, {
    fields: [chats.userId2],
    references: [users.id],
    relationName: 'user2_in_chats',
  }),
  messages: many(messages),
}));
