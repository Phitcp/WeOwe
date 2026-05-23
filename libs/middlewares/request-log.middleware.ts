import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { OperationContextService } from 'libs/decorators/operation-context.service';

export const traceIdHeaderKey = 'x-trace-id';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: Logger,
    private readonly operationContextService: OperationContextService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.headers[traceIdHeaderKey] || crypto.randomUUID();
    if (!traceId) {
      req.headers[traceIdHeaderKey] = traceId;
    }
    this.logger.log(
      `[${req.method}] - ${req.originalUrl} - Trace ID: ${traceId}`,
    );
    this.operationContextService.run({ traceId: traceId as string }, () =>
      next(),
    );
  }
}
