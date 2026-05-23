import { Metadata } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OperationContextService } from 'libs/decorators/operation-context.service'; 
import { randomUUID } from 'crypto';
import { traceIdHeaderKey } from 'libs/middlewares/request-log.middleware';

@Injectable()
export class GrpcContextInterceptor implements NestInterceptor {
  constructor(private readonly operationContext: OperationContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const grpcContext = context.switchToRpc().getContext<Metadata>();
    
    const traceId = grpcContext.get(traceIdHeaderKey)[0] as string ?? randomUUID();

    return new Observable(observer => {
      this.operationContext.run({ traceId }, () => {
        next.handle().subscribe({
          next: val => observer.next(val),
          error: err => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }
}