import { relations } from 'drizzle-orm';
import { pgEnum, varchar } from 'drizzle-orm/pg-core';
import { createTable } from '../table-creator';
import { users } from './auth';

export const statusEnum = pgEnum('status', ['pending', 'accepted', 'rejected']);

export const friendRequests = createTable('friend_requests', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  senderId: varchar('sender_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  receiverId: varchar('receiver_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  status: statusEnum('status').$default(() => 'pending'),
});

export const friends = createTable('friends', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user1Id: varchar('user_1_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  user2Id: varchar('user_2_id', { length: 255 })
    .notNull()
    .references(() => users.id),
});

// RELATIONS

export const friendRequestsRelations = relations(friendRequests, ({ one }) => ({
  sender: one(users, {
    fields: [friendRequests.senderId],
    references: [users.id],
    relationName: 'sent_requests',
  }),
  receiver: one(users, {
    fields: [friendRequests.receiverId],
    references: [users.id],
    relationName: 'received_requests',
  }),
}));

export const friendsRelations = relations(friends, ({ one }) => ({
  user1: one(users, {
    fields: [friends.user1Id],
    references: [users.id],
    relationName: 'friends_1',
  }),
  user2: one(users, {
    fields: [friends.user2Id],
    references: [users.id],
    relationName: 'friends_2',
  }),
}));
