# WeOwe — Product & Engineering Plan

## Product Vision

A production-ready expense splitting application focused on:

* Transparent expense tracking
* Immutable expense revisions
* Anti-fraud audit history
* Smart debt simplification
* Realtime notifications
* QR/deeplink settlement flows
* Future AI-powered travel & group assistant features

Positioning:

```txt
Splitwise but transparent.
```

---

# Tech Stack

| Layer             | Stack                     |
| ----------------- | ------------------------- |
| Backend Core      | NestJS                    |
| Language          | TypeScript                |
| Database          | MongoDB                   |
| ODM               | Mongoose                  |
| Web               | NextJS                    |
| Mobile            | Expo React Native         |
| Realtime          | Socket.IO                 |
| Push Notification | Firebase FCM              |
| AI Service        | Go                        |
| Deployment        | Railway / Render / Vercel |
| Monorepo          | Turborepo                 |

---

# Architecture Direction

## Core Principle

NEVER directly update expenses.

Instead:

```txt
expense
expense_revisions
audit_logs
```

Every modification creates a new revision.

Benefits:

* Anti-fraud
* Full history tracking
* Financial consistency
* Rollback capability
* Better notifications
* Auditability

---

# Monorepo Structure

```txt
splitpay/
├── apps/
│   ├── api/
│   ├── web/
│   ├── mobile/
│   └── ai-service/
│
├── packages/
│   ├── shared-types/
│   ├── eslint-config/
│   └── tsconfig/
```

---

# Backend Structure

```txt
src/
├── common/
├── config/
├── database/
├── auth/
├── users/
├── groups/
├── expenses/
├── settlements/
├── notifications/
└── audit-logs/
```

---

# Core Database Design

## expenses

```ts
{
  _id,
  groupId,
  currentRevisionId,
  status,
  createdBy,
  createdAt
}
```

---

## expense_revisions

```ts
{
  _id,
  expenseId,
  version,

  title,
  amount,

  payerId,

  splits: [
    {
      userId,
      amount
    }
  ],

  editReason,

  editedBy,
  createdAt
}
```

---

## settlements

```ts
{
  groupId,

  fromUserId,
  toUserId,

  amount,

  paymentMethod,
  status,

  createdAt
}
```

---

## audit_logs

```ts
{
  entityType,
  entityId,
  action,

  performedBy,

  metadata,

  createdAt
}
```

---

# Core Features (V1)

## Authentication

* Register
* Login
* JWT auth
* Refresh token
* Protected routes

---

## Groups

* Create group
* Invite users
* Join group

---

## Expenses

* Create expense
* Edit via revisions only
* Expense history
* Audit logs
* Full revision timeline

---

## Balance Engine

* Calculate balances
* Simplify debt
* Net balances

Example:

```txt
A owes B 10
B owes C 5
C owes A 10
```

Simplified:

```txt
C pays B 5
```

---

## Settlement

* QR payment flow
* Deeplink payment flow
* VietQR integration
* Manual confirmation

---

## Notifications

* Realtime notifications
* Expense update alerts
* Settlement alerts
* Group invite alerts

Architecture:

```txt
Expense Service
    ↓
EventEmitter
    ↓
Notification Listener
    ↓
Socket.IO + FCM
```

---

# API Design

## Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/refresh
```

---

## Groups

```txt
POST /groups
GET /groups/:id
POST /groups/:id/invite
```

---

## Expenses

```txt
POST /expenses
POST /expenses/:id/revisions
GET /expenses/:id/history
```



# AI Features Backlog (V2+)

## Receipt OCR

Features:

* Scan receipts
* Extract bill items
* Attach proof images
* Refund evidence

Schema:

```ts
{
  expenseId,
  imageUrl,
  extractedItems,
  rawOCRText,
  uploadedBy
}
```

Suggested tech:

* Google ML Kit
* Google Vision API

---

## AI Assistant

Features:

* Food recommendation
* Group trip planning
* Travel recommendations
* Budget suggestions
* Restaurant suggestions

Example:

```txt
Find dinner for 5 people
under 300k/person
near District 1
```

---

## AI Cost Optimization

Examples:

* Detect overspending
* Suggest cheaper alternatives
* Compare trip expenses
* Budget analytics

---

## AI Personalized Travel Memory

Features:

* Learn travel habits
* Suggest future trips
* Remember budget preferences
* Spending analytics

---

## Translation Layer

Features:

* Translate expense descriptions
* Multi-language support
* Auto language detection

Suggested providers:

* Google Translation API
* DeepL API

Future AI enhancement:

* Context explanations
* Cultural explanation layer

---

# AI Service (Go)

## Purpose

Use Go specifically for:

* AI orchestration
* Recommendation systems
* OCR workers
* Translation services
* AI chat assistant
* Streaming responses

---

## Structure

```txt
ai-service/
├── recommendation-engine/
├── translation/
├── receipt-ocr/
├── trip-planner/
└── ai-chat/
```

---

## Communication

Initial architecture:

```txt
NestJS API
   ↓ HTTP
Go AI Service
```

---

# AI Engineering Workflow

## Tools

| Tool      | Usage                          |
| --------- | ------------------------------ |
| Copilot   | Boilerplate + autocomplete     |
| Claude    | Architecture + refactor        |
| GPT/Codex | Design discussion + edge cases |

---



---

# Final V1 Definition

```txt
- register/login
- create groups
- create expenses
- immutable revisions
- audit history
- calculate balances
- simplify debt
- settle up QR
- realtime notifications
```

THAT IS ENOUGH TO SHIP.
