'use client';

import { useOnEvents } from '~/hooks/subscriptions/use-on-events';

export const EventsSubscriber = () => {
  // one subscriber to all api subscriptions
  useOnEvents();

  return null;
};
