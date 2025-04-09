import { relations } from 'drizzle-orm';
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
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  isRead: boolean('is_read').notNull().default(false),
  isSent: boolean('is_sent').notNull().default(true),
  isLiked: boolean('is_liked').notNull().default(false),
});

// RELATIONS

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'message_sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'message_receiver',
  }),
}));

// TYPES

export type ChatMessage = typeof messages.$inferSelect;
