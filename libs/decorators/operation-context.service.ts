import { Injectable } from "@nestjs/common";
import { asyncLocalStorage, OperationContext } from "./operation-context";

@Injectable()
export class OperationContextService {
  getContext(): OperationContext | undefined {
    return asyncLocalStorage.getStore();
  }

  getTraceId(): string | undefined {
    return this.getContext()?.traceId;
  }

  run(context: OperationContext, fn: () => void) {
    asyncLocalStorage.run(context, fn);
  }
}