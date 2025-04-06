'use client';

import { onEvents } from '~/hooks/subscriptions/on-events';

export const EventsSubscriber = () => {
  // one subscriber to all api subscriptions
  onEvents();

  return null;
};
