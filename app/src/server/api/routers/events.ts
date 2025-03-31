import { ee } from '~/server/api/event-emitter';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const eventsRouter = createTRPCRouter({
  onEvent: protectedProcedure.subscription(async function* ({ ctx }) {
    for await (const [data] of ee.toIterable('event')) {
      if (data.eventReceiverId === ctx.session.user.id) {
        yield data;
      }
    }
  }),
});
