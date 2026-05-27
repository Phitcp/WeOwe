import { Injectable } from '@nestjs/common';
import { asyncLocalStorage, OperationContext } from './operation-context';

@Injectable()
export class OperationContextService {
  getContext(): OperationContext {
    const context = asyncLocalStorage.getStore();
    if (!context) {
      throw new Error('OperationContext is not available');
    }
    return context;
  }

  getTraceId(): string | undefined {
    return this.getContext()?.traceId;
  }

  add(record: Record<string, any>) {
    const store = asyncLocalStorage.getStore();

    if (!store) {
      return;
    }

    Object.assign(store, record);
  }

  run(context: OperationContext, fn: () => void) {
    asyncLocalStorage.run(context, fn);
  }
}
