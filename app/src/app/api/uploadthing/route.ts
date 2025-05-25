import { createRouteHandler } from 'uploadthing/next';
import { uploadRouter } from './core';

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
