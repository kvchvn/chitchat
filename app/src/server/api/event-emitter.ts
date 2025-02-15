import EventEmitter, { on } from 'node:events';
import { type ChatMessage } from '../db/schema/messages';

type AppEvents = {
  sendMessage: (message: ChatMessage) => void;
};

declare interface AppEventEmitter {
  on<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  off<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  once<E extends keyof AppEvents>(event: E, listener: AppEvents[E]): this;
  emit<E extends keyof AppEvents>(event: E, ...args: Parameters<AppEvents[E]>): boolean;
}

class AppEventEmitter extends EventEmitter {
  public toIterable<E extends keyof AppEvents>(event: E): AsyncIterable<Parameters<AppEvents[E]>> {
    return on(this, event);
  }
}

export const ee = new AppEventEmitter();
