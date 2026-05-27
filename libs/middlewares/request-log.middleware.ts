import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from 'libs/common/logger';
import { OperationContextService } from 'libs/decorators/operation-context.service';

export const traceIdHeaderKey = 'x-trace-id';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly operationContextService: OperationContextService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.headers[traceIdHeaderKey] || crypto.randomUUID();
    if (!traceId) {
      req.headers[traceIdHeaderKey] = traceId;
    }
    this.operationContextService.run({ traceId: traceId as string }, () => {
      this.appLogger.pushContext(`Gateway || ${traceId}`);
      this.appLogger.log(`[${req.method}] - ${req.originalUrl}`);
      res.on('finish', () => {
        this.appLogger.popContext();
      });
      return next();
    });
  }
}
