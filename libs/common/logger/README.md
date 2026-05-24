# Custom Logger Service

A request-scoped logger service that extends NestJS Logger with context support.

## Features

- Extends NestJS `Logger`
- Request-scoped to maintain per-request context
- `addLogContext()` method to add context prefix to all logs in a request
- Automatic formatting of log messages with context prefix

## Usage

### 1. Import LoggerModule in your app module

```typescript
import { LoggerModule } from 'libs/common/logger';

@Module({
  imports: [
    // other imports...
    LoggerModule,
  ],
  // ...
})
export class AppModule {}
```

### 2. Inject CustomLoggerService

```typescript
import { CustomLoggerService } from 'libs/common/logger';

@Injectable()
export class MyService {
  constructor(private logger: CustomLoggerService) {}

  async doSomething() {
    this.logger.addLogContext('user-123');
    this.logger.log('Success'); // Outputs: "user-123 || Success"
    this.logger.error('Error occurred'); // Outputs: "user-123 || Error occurred"
  }
}
```

## How it works

The service uses NestJS's `AsyncLocalStorage` (via `OperationContextService`) to store per-request context. When `addLogContext()` is called:

1. The context string is stored in the operation context
2. All subsequent log calls in that request automatically include the context prefix
3. The context is isolated per request and doesn't affect other concurrent requests

## Log Levels Supported

- `log(message, context?)`
- `error(message, stack?, context?)`
- `warn(message, context?)`
- `debug(message, context?)`
- `verbose(message, context?)`
- `addLogContext(context)` - Add request context

## Scope

The service is `TRANSIENT` scoped, meaning a new instance is created for each injection. This works well with the request-scoped `OperationContextService`.
