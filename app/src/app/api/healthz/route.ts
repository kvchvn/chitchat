import { db } from '~/server/db';
import { users } from '~/server/db/schema/users';

const handler = async () => {
  // test request to the db
  const allUsers = await db.select().from(users);

  const json = JSON.stringify({
    ok: true,
    users: allUsers.length,
  });
  return new Response(json, { status: 200 });
};

export { handler as GET };
