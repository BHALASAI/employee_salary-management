# ACME Salary Management Constitution

## Core Principles

### I. Specifications Are the Product Contract
Every feature starts with prioritized user scenarios, observable acceptance criteria, explicit exclusions, and measurable outcomes. Plans and tasks MUST trace to those requirements. When implementation and specification differ, the discrepancy MUST be resolved before the feature is considered converged.

### II. Protect Salary Data by Default
All business endpoints require authentication. Authorization MUST be enforced by the backend, with UI restrictions treated only as usability aids. Credentials and signing secrets MUST be configurable, sensitive values MUST never be logged, and all external input MUST be validated before persistence or query construction.

### III. Preserve Monetary Meaning
Salary and bonus values MUST use decimal arithmetic, retain their ISO-style three-letter currency, and remain non-negative. Cross-currency totals MUST remain separated without an explicit conversion policy and exchange-rate source. Any unconverted aggregate MUST be labeled as local currency units and MUST NOT be represented as a normalized monetary value.

### IV. Database-First Scale
Search, filtering, sorting, pagination, and aggregation MUST execute in the database. List APIs MUST be bounded, deterministic, and usable with the 10,000-record baseline dataset. New query paths require an index or a documented reason why one is unnecessary.

### V. Tests Are Delivery Evidence
Business rules, authorization boundaries, validation, API contracts, and frontend service behavior MUST have automated tests proportionate to risk. Every feature plan MUST name its focused checks, and implementation is complete only after those checks pass. Defects require a regression test when practical.

### VI. Keep the Architecture Direct
The Angular client, Spring REST controllers, domain services, repositories, and SQLite persistence retain distinct responsibilities. Changes MUST reuse these boundaries and established dependencies unless the plan documents a concrete need for added complexity.

## Engineering Constraints

- Runtime stack: Java 17, Spring Boot 3.5.x, Angular 18, TypeScript 5.5, and SQLite for local/demo use.
- APIs use stable JSON DTOs and centralized error responses; JPA entities are not exposed directly.
- The application remains responsive and keyboard-usable across supported desktop and mobile widths.
- Production deployments require an external `JWT_SECRET` and durable managed storage for real employee data.
- Payroll processing, taxes, benefits, payments, currency conversion, SSO, auditing, and multi-tenancy remain outside the baseline unless separately specified.

## Delivery Workflow

Each feature follows `specify -> clarify when needed -> plan -> tasks -> implement -> converge`. Reviews verify requirement-to-task traceability, constitution gates, focused tests, and documentation. Completed baseline artifacts are living contracts: later behavior changes update the specification and downstream artifacts in the same change.

## Governance

This constitution governs all feature specifications and implementation plans. Amendments require a documented rationale, affected-artifact review, and semantic version change. Compliance is checked during planning and convergence; exceptions appear in the plan's Complexity Tracking table with a removal path.

**Version**: 1.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-09-27
