import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { OperationContextService } from "libs/decorators/operation-context.service";
import { Observable } from "rxjs";

// apps/gateway/src/interceptors/context.interceptor.ts
@Injectable()
export class ExtractTokenInterceptor implements NestInterceptor {
  constructor(private readonly operationContext: OperationContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    this.operationContext.add({
      user: request?.user,
    });

    return next.handle();
  }
}