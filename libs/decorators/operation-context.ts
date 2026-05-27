import { AsyncLocalStorage } from 'async_hooks';

export interface UserContext {
  userId: string;
}
export interface OperationContext {
  traceId: string;
  user?: UserContext;
  logContexts?: string[];
  refreshToken?: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<OperationContext>();