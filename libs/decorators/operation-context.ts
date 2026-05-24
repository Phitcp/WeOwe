import { AsyncLocalStorage } from 'async_hooks';

export interface OperationContext {
  traceId: string;
  userId?: string;
  logContexts?: string[];
}

export const asyncLocalStorage = new AsyncLocalStorage<OperationContext>();