import { relations, sql } from 'drizzle-orm';
import { boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createTable } from '../table-creator';
import { chats } from './chats';
import { users } from './users';

export const messages = createTable('messages', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: varchar('chat_id', { length: 255 }).notNull(),
  senderId: varchar('sender_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  receiverId: varchar('receiver_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  text: varchar('text', { length: 255 }).notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  hasRed: boolean('has_red').notNull().default(false),
});

export const messageLikes = createTable('message_likes', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  messageId: varchar('message_id', { length: 255 }).notNull(),
  likedById: varchar('liked_by_id', { length: 255 }).notNull(),
});

// RELATIONS

export const messagesRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  likes: many(messageLikes),
}));

export const messageLikesRelations = relations(messageLikes, ({ one }) => ({
  message: one(messages, {
    fields: [messageLikes.messageId],
    references: [messages.id],
  }),
  likedBy: one(users, {
    fields: [messageLikes.likedById],
    references: [users.id],
  }),
}));
