import EventEmitter, { on } from 'node:events';
import { type EventData } from '~/server/api/event-types';

type AppEvents = {
  event: (data: EventData) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
declare interface AppEventEmitter {
  on<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  off<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  once<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  emit<E extends keyof AppEvents>(event: E, ...args: Parameters<AppEvents[E]>): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class AppEventEmitter extends EventEmitter {
  public toIterable<E extends keyof AppEvents>(event: E): AsyncIterable<Parameters<AppEvents[E]>> {
    return on(this, event) as AsyncIterable<Parameters<AppEvents[E]>>;
  }
}

export const ee = new AppEventEmitter();
