# Data Model: Employee Records

## Employee

| Field | Rule |
| --- | --- |
| `id` | Database-generated identifier |
| `employeeId` | Required, unique, maximum 30 characters |
| `firstName`, `lastName` | Required, maximum 80 characters each |
| `email` | Required, valid, unique, maximum 160 characters |
| `department` | Required, maximum 100 characters |
| `jobTitle` | Required, maximum 120 characters |
| `country` | Required, maximum 80 characters |
| `currency` | Required, exactly three uppercase letters |
| `baseSalary`, `bonus` | Required, non-negative decimal `(15,2)` |
| `effectiveDate` | Required, past or present date |
| `active` | Required boolean |

Indexes support email, country, department, and active filters. Employee ID and email uniqueness is enforced in persistence.

## PageResponse

Contains `content`, zero-based `page`, actual `size`, `totalElements`, and `totalPages`.

## Validation Transitions

Create assigns a generated ID after all validation and uniqueness checks. Update preserves the target ID while replacing mutable fields. Delete removes the row after existence and authorization checks.