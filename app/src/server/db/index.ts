import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '~/env';
import * as authSchema from './schema/auth';
import * as friendsSchema from './schema/friends';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

const schema = { ...authSchema, ...friendsSchema };

export const db = drizzle(conn, { schema });
