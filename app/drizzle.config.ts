import dotenv from 'dotenv';
import { type Config } from 'drizzle-kit';

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development.local' : '.env.production.local',
});

export default {
  schema: './src/server/db/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  tablesFilter: ['chitchat-v2_*'],
  out: './drizzle/migrations',
} satisfies Config;
