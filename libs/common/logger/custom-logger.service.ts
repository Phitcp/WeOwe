import { Injectable, Logger, Scope } from '@nestjs/common';
import { OperationContextService } from 'libs/decorators/operation-context.service';

@Injectable()
export class AppLogger extends Logger {
  constructor(
    private operationContextService: OperationContextService,
  ) {
    super('AppLogger');
  }

  /**
   * Add log context to be prefixed to the next log call.
   * Multiple calls will accumulate contexts.
   * All contexts will be cleared after the next log call.
   * @param context - The context string to add
   */
  addLogContext(context: string): void {
    const currentContext = this.operationContextService.getContext();
    if (currentContext) {
      if (!currentContext.logContexts) {
        currentContext.logContexts = [];
      }
      currentContext.logContexts.push(context);
    }
  }

  /**
   * Get the formatted log message with all accumulated contexts.
   * Contexts persist throughout the request scope.
   */
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
