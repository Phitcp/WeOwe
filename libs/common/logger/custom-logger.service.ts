import { Injectable, Logger, Scope } from '@nestjs/common';
import { OperationContextService } from 'libs/decorators/operation-context.service';

@Injectable()
export class AppLogger extends Logger {
  private contextSnapshots: (string[] | undefined)[] = [];

  constructor(private operationContextService: OperationContextService) {
    super('AppLogger');
  }

  pushContext(context: string): void {
    const currentContext = this.operationContextService.getContext();
    if (currentContext) {
      // Take a snapshot of the current state before modifying
      this.contextSnapshots.push(currentContext.logContexts);
      
      // Create a new context array (immutable approach) instead of mutating
      currentContext.logContexts = [
        ...(currentContext.logContexts || []),
        context,
      ];
    }
  }

  // Use this to pop the last context, mainly for cases when you want to pop the context before the end of the method execution, otherwise, you can just rely on the LogContext decorator to pop the context in the finally block
  popContext(): void {
    const currentContext = this.operationContextService.getContext();
    if (currentContext && this.contextSnapshots.length > 0) {
      // Restore to the previous snapshot instead of mutating the array
      currentContext.logContexts = this.contextSnapshots.pop();
    }
  }

  private formatMessage(message: string): string {
    const context = this.operationContextService.getContext();
    const logContexts = context?.logContexts;

    if (logContexts && logContexts.length > 0) {
      return `${logContexts.join(' || ')} || ${message}`;
    }

    return message;
  }

  log(message: any, context?: string): void {
    super.log(this.formatMessage(message));
  }

  error(message: any, stack?: string, context?: string): void {
    super.error(this.formatMessage(message), stack);
  }

  warn(message: any, context?: string): void {
    super.warn(this.formatMessage(message));
  }

  debug(message: any, context?: string): void {
    super.debug(this.formatMessage(message));
  }

  verbose(message: any, context?: string): void {
    super.verbose(this.formatMessage(message));
  }
}

export function LogContext(contextString: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: any, ...args: any[]) {
      const logger: AppLogger = this.logger || this.appLogger;

      if (!logger) {
        console.warn(
          `LogContext decorator: No logger found on ${target.constructor.name}.${propertyKey}`,
        );
        return originalMethod.apply(this, args);
      }

      logger.pushContext(contextString);
      let isAsync = false;

      try {
        const result = originalMethod.apply(this, args);

        // Handle async/Promise
        if (result && typeof result.then === 'function') {
          isAsync = true;
          return result.finally(() => {
            logger.popContext();
          });
        }

        return result;
      } finally {
        // Pop context for sync methods (async methods pop in Promise.finally)
        if (!isAsync) {
          logger.popContext();
        }
      }
    };

    return descriptor;
  };
}
