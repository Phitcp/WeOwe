# Backend Architecture

## Services

### Gateway
Responsibilities:
- REST APIs
- Websocket gateway
- JWT validation
- Request aggregation

### Auth Service
Responsibilities:
- register/login
- JWT issuing
- refresh token

### Core Service
Responsibilities:
- groups
- expenses
- balances
- settlements

---

## Communication

- REST externally
- gRPC internally

---

## Database Ownership

Auth Service:
- users
- credentials

Core Service:
- groups
- expenses
- settlements