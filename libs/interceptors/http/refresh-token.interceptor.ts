import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { OperationContextService } from "libs/decorators/operation-context.service";
import { Observable } from "rxjs";

// apps/gateway/src/interceptors/context.interceptor.ts
@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly operationContext: OperationContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers['x-refresh-token'];
    this.operationContext.add({
      user: request?.user,
      refreshToken,
    });

    return next.handle();
  }
}