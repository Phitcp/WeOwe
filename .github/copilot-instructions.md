# WeOwe Copilot Instructions

## Project Overview

WeOwe is a production-oriented expense splitting application.

Core principles:
- Transparency
- Auditability
- Immutable expense revisions
- Realtime synchronization

---

## Architecture

- NestJS monorepo
- Gateway + gRPC services
- Feature-based modules
- MongoDB
- Modular microservice boundaries

---

## Critical Business Rules

- NEVER update expenses directly
- Every expense modification creates a revision
- Settled expenses cannot be modified
- Split totals must equal expense amount

---

## Backend Rules

- Controllers stay thin
- Business logic belongs in services
- Repositories handle DB access only
- DTO validation required
- Use Swagger decorators
- Prefer explicit naming

---

## Style Rules
- Injection should not be inject directly in the constructor, instead, it should be injected in the service and then the service should be injected in the constructor, this will make it easier to maintain and test.
Example:
```typescript
class A {
  @Inject(ServiceA) private serviceA: ServiceA;
  constructor() {}
}
```

- When you have a class that is extended by multiple services, create a base dependency container class so child services only inject one base dependency instead of many separate dependencies.
Example:
```typescript
@Injectable()
class BaseDependencies {
  @Inject(UserService) protected readonly userService: UserService;
  @Inject(ExpenseService) protected readonly expenseService: ExpenseService;
  @Inject(NotificationService) protected readonly notificationService: NotificationService;
}

@Injectable()
class ChildServiceA extends BaseDependencies {
  constructor() {
    super();
  }

  async process() {
    await this.userService.findAll();
    await this.expenseService.createExpense(...);
  }
}
```

- If there's a repeated injection, you should create a new service and inject it there, then inject that service in the constructor, this will make it easier to maintain and test.


- Avoid using any type, use unknown instead and then narrow it down to the specific type, this will make it easier to maintain and test.
- Keep functions small
- Avoid deeply nested logic
- Use early returns
- Prefer readability over abstraction

## Common function rules
- If that function can be used in multiple apps, it should be moved to a shared library
- Utils function should be write in util.service.ts, then other module can import by injection, do not write it in a separate file and export it, this will make it hard to maintain and test.