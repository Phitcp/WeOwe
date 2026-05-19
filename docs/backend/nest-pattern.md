# NestJS Backend Patterns

## Module Structure

Each feature module contains:
- controller
- service
- repository
- dto
- schema

---

## Controller Rules

Controllers should:
- validate input
- call services
- return response only

Controllers should NOT:
- contain business logic
- contain DB queries

---

## Service Rules

Services:
- contain business logic
- orchestrate repositories
- emit events

---

## Repository Rules

Repositories:
- handle DB access only
- contain query logic
- avoid business logic