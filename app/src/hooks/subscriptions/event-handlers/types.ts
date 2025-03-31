import { type EventAction, type ExtractDataFromAction } from '~/server/api/event-types';
import { type api } from '~/trpc/react';

export type BaseHandlerArgs<Action extends EventAction> = {
  utils: ReturnType<typeof api.useUtils>;
  data: ExtractDataFromAction<Action>;
};
