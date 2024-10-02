import { serial, varchar } from 'drizzle-orm/pg-core';
import { createTable } from '../table-creator';

export const messages = createTable('message', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 256 }).notNull(),
});
