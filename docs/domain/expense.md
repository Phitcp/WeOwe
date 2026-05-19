# Expense Domain Rules

Invariants:
- Split totals must equal expense amount
- Expense revisions are append-only
- Settled expenses cannot be edited
- Notifications required for affected users

Flow:
1. Create expense
2. Create revision
3. Create audit log
4. Emit event
5. Send notifications