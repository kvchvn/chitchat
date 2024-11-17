import { relations } from 'drizzle-orm';
import { pgEnum, varchar } from 'drizzle-orm/pg-core';
import { createTable } from '~/server/db/table-creator';
import { users } from '~/server/db/schema/auth';

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
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  friendId: varchar('friend_id', { length: 255 })
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
  userId: one(users, {
    fields: [friends.userId],
    references: [users.id],
    relationName: 'friends',
  }),
  friendId: one(users, {
    fields: [friends.friendId],
    references: [users.id],
    relationName: 'friend_of',
  }),
}));
