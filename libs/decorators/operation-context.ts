import { AsyncLocalStorage } from 'async_hooks';

export interface OperationContext {
  traceId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<OperationContext>();