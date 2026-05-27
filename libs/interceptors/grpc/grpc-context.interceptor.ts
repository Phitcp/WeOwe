import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OperationContextService } from 'libs/decorators/operation-context.service'; 
import { AppLogger } from 'libs/common/logger';
import { randomUUID } from 'crypto';

@Injectable()
export class GrpcContextInterceptor implements NestInterceptor {
  constructor(
    private readonly operationContext: OperationContextService,
    private readonly appLogger: AppLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const grpcContext = context.switchToRpc().getContext<Metadata>();
    
    const traceId = grpcContext.get('traceId')[0] as string ?? randomUUID();
    const method = context.getHandler().name;

    return new Observable(observer => {
      this.operationContext.run({ traceId }, () => {
        this.appLogger.pushContext(`Core: ${traceId}`);
        this.appLogger.log(`gRPC: ${method}`);
        
        next.handle().subscribe({
          next: val => observer.next(val),
          error: err => {
            this.appLogger.popContext();
            observer.error(err);
          },
          complete: () => {
            this.appLogger.popContext();
            observer.complete();
          },
        });
      });
    });
  }
}