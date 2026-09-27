# Planning and Design Notes

## Planning Context

ACME Salary Management is a specification-driven demonstration application for maintaining compensation data for 10,000 employees. The plan prioritizes secure role-based access, bounded employee discovery, validated record maintenance, currency-aware reporting, repeatable demo data, and low-friction deployment.

The [Spec Kit feature baseline](../specs/README.md) defines expected behavior. The [system architecture](architecture.md) documents HLD and LLD. This document records the planning rationale connecting those requirements to the delivered design.

## Product Goals

- Let authenticated staff locate employee records quickly.
- Let authorized HR users create and correct compensation records safely.
- Separate read, edit, and delete permissions by role.
- Present useful workforce metrics without misrepresenting currencies.
- Demonstrate acceptable behavior with 10,000 deterministic records.
- Package the frontend and backend as one deployable evaluation service.

## Scope Boundaries

### Included

- JWT login for `ADMIN`, `HR_MANAGER`, and `VIEWER`.
- Employee and compensation create, read, update, and delete workflows.
- Search, filters, sorting, and server-side pagination.
- Headcount, averages, currency totals, country counts, and department counts.
- SQLite persistence and deterministic seed data.
- Responsive Angular UI and Spring Boot REST API.
- Health checks, Docker packaging, and Render demo deployment.
- Automated service, security, and HTTP-client tests.

### Excluded

- Payroll execution, tax, benefits, payslips, and payment integration.
- Exchange-rate conversion or consolidated cross-currency totals.
- Approval workflows, audit history, notifications, and salary history.
- Bulk spreadsheet import/export.
- SSO, MFA, password recovery, and user administration.
- Multi-tenancy, localization, and production-grade data durability.

## Design Drivers

| Driver | Planning response |
| --- | --- |
| Sensitive salary data | Backend-enforced authentication, authorization, validation, and configurable signing secrets |
| Three access levels | Fixed role matrix with method-level write authorization |
| 10,000 employee baseline | Database-side paging, filtering, sorting, grouping, and bounded responses |
| Multiple currencies | Decimal amounts, currency codes, separated totals, explicit local-unit labels |
| Fast evaluation setup | Deterministic startup seed and SQLite defaults |
| Simple hosting | One Docker image serving the Angular SPA and Spring API |
| Maintainable implementation | Layered modular monolith with DTO and repository boundaries |

## Architecture Decision Summary

### AD-001: Modular Monolith

- **Decision**: Use Angular and Spring Boot as separate source/build modules packaged into one runtime service.
- **Rationale**: The domain and expected load do not justify distributed services. One deployable simplifies local setup, security, routing, and demonstration.
- **Alternative**: Separate frontend, identity, employee, and reporting services.
- **Consequence**: Scaling and deployment happen at application level, but operational complexity stays low.

### AD-002: Layered Backend

- **Decision**: Separate controllers, services, repositories, entities, DTOs, security, and cross-cutting error handling.
- **Rationale**: HTTP concerns, business rules, and persistence evolve independently and remain testable.
- **Alternative**: Controllers accessing repositories directly.
- **Consequence**: Some mapping code is required, but API contracts do not expose JPA entities.

### AD-003: SQLite Behind JPA

- **Decision**: Use SQLite for local and evaluation persistence through Spring Data JPA.
- **Rationale**: It is relational, portable, and requires no external service.
- **Alternative**: Managed PostgreSQL from the first release.
- **Consequence**: The demo is simple, but concurrent writes, horizontal scaling, migrations, and durable cloud storage require a later database change.

### AD-004: Stateless JWT Authentication

- **Decision**: Authenticate credentials with Spring Security and issue short-lived JWTs stored in browser session storage.
- **Rationale**: A stateless API fits the Angular client and single-container deployment.
- **Alternative**: Server sessions or secure same-site cookies.
- **Consequence**: The server needs no session store, while production still requires stronger token lifecycle and browser-threat controls.

### AD-005: Fixed Role Matrix

- **Decision**: Give all roles read access, `ADMIN` and `HR_MANAGER` create/update access, and only `ADMIN` delete access.
- **Rationale**: It demonstrates least privilege without adding identity administration.
- **Alternative**: Fine-grained permissions stored per user.
- **Consequence**: Authorization is easy to reason about but not dynamically configurable.

### AD-006: Server-Side Employee Discovery

- **Decision**: Execute search, filters, sorting, and pagination in the database; default pages to 25 and cap them at 100.
- **Rationale**: The browser never loads all 10,000 employees.
- **Alternative**: Download and filter the complete dataset in Angular.
- **Consequence**: API requests remain bounded, while wildcard text search may need stronger indexing at larger scale.

### AD-007: Database-Projected Dashboard

- **Decision**: Use count, average, sum, and group-by repository projections.
- **Rationale**: Reporting sends only aggregated data to the browser.
- **Alternative**: Load employee rows and aggregate in Java or TypeScript.
- **Consequence**: The dashboard is efficient for the baseline, though its seven sequential queries may need optimization under higher concurrency.

### AD-008: Currency-Safe Totals

- **Decision**: Keep base salary totals separated by currency and label global averages as unconverted local currency units.
- **Rationale**: Adding unlike currencies would create misleading financial values.
- **Alternative**: Convert into one reporting currency.
- **Consequence**: The baseline avoids false precision but cannot provide normalized global payroll analytics.

### AD-009: Deterministic Conditional Seed

- **Decision**: Seed three missing demo identities and generate 10,000 employees with random seed `42` only when no employee exists.
- **Rationale**: Evaluators receive repeatable data without duplicate rows after restart.
- **Alternative**: Import fixtures on every startup or require a setup script.
- **Consequence**: Startup is self-contained, but a partially populated employee table does not receive missing seed rows.

### AD-010: Single Non-Root Container

- **Decision**: Build Angular and Spring Boot in separate Docker stages, package static assets in the JAR, and run as UID `10001`.
- **Rationale**: One origin avoids production CORS complexity and one service reduces deployment steps.
- **Alternative**: Deploy frontend and API independently.
- **Consequence**: Frontend and backend release together and cannot scale independently.

## Design Patterns

| Pattern | Location | Purpose |
| --- | --- | --- |
| Layered architecture | Spring controllers, services, repositories | Separates transport, domain, and persistence responsibilities |
| Repository | `EmployeeRepository`, `UserRepository` | Encapsulates persistence and aggregate queries |
| Service Layer | `AuthService`, `EmployeeService`, `DashboardService` | Coordinates domain behavior and transactions |
| DTO | Auth, employee, dashboard, page, and error records | Stabilizes API contracts and hides persistence entities |
| Dependency Injection | Spring constructors and Angular constructors/functions | Provides dependencies without manual global construction |
| Front Controller | Spring MVC dispatcher | Routes HTTP requests into controllers |
| Intercepting Filter | `JwtAuthenticationFilter`, Angular `authInterceptor` | Applies authentication concerns around requests |
| Route Guard | Angular `authGuard` | Prevents unauthenticated client navigation |
| Observer | RxJS HTTP observables and subscriptions | Handles asynchronous API results |
| Static Factory Method | `EmployeeResponse.from`, `PageResponse.from`, `ApiError.of` | Centralizes object conversion and creation |
| Repository Projection | Dashboard query interfaces | Returns aggregate shapes without loading entities |

No explicit Builder or Abstract Factory implementation is needed. The records and constructors are small, while Spring and Angular frameworks provide object creation through dependency injection.

## Component Delivery Plan

| Phase | Scope | Main outputs | Status |
| --- | --- | --- | --- |
| 1 | Identity and access | JWT login, role policy, guard, interceptor, session behavior | Complete |
| 2 | Employee records | Entity/DTOs, validation, CRUD, search, filters, paging, forms | Complete |
| 3 | Compensation insights | Database aggregates, summary API, responsive dashboard | Complete |
| 4 | Operational delivery | Seed data, configuration, health, Docker, Render documentation | Complete |
| 5 | Convergence | Cross-artifact review, focused tests, documentation alignment | Ongoing quality gate |

Each phase has its own specification, plan, research, data model, contract, quickstart, tasks, and checklist under `specs/`.

## API and Data Planning

- Public API surface is limited to login and health.
- Business APIs use JSON DTOs and require bearer authentication.
- Bean Validation rejects malformed employee input before service execution.
- Service checks provide understandable duplicate conflicts; database uniqueness remains the final authority.
- Missing employees return `404`; duplicate identifiers return `409`; invalid fields return `400`.
- Monetary fields use decimal storage with two fractional digits.
- Users and employees have no persistence relationship because users authorize the application rather than own employee records.

## Security Planning

- Keep authorization in Spring Security and controller method rules.
- Treat Angular role checks only as presentation behavior.
- Hash passwords with BCrypt and never return hashes.
- Supply `JWT_SECRET` externally for deployment.
- Keep error messages generic for invalid credentials.
- Validate every externally supplied employee field.
- Do not use demo credentials or SQLite for real payroll data.

Future production design should add managed identity or stronger account lifecycle, token revocation/refresh policy, audit history, rate limiting, security headers, dependency scanning, and centralized observability.

## Performance Planning

### Baseline

- Validate all list behavior against 10,000 records.
- Keep employee pages bounded to 100 rows.
- Use database projections for dashboard metrics.
- Insert seed data in groups of 500; Hibernate JDBC batching uses size 100.
- Avoid retaining the full employee dataset in browser state.

### Production Validation

- Capture query plans for search and grouped metrics.
- Measure request latency and startup seed duration.
- Load-test at 10,000 and 100,000 records.
- Evaluate full-text or normalized search indexes for leading-wildcard queries.
- Configure connection pooling and database observability after migrating from SQLite.
- Consider consolidating or caching dashboard queries only after measurements justify it.

## Verification Strategy

| Area | Automated evidence | Additional validation |
| --- | --- | --- |
| Authentication | Auth service, JWT service, and security configuration tests | Invalid, expired, and role-specific request matrix |
| Employee domain | Duplicate, mapping, and filter normalization tests | Controller contracts, all validation fields, delete authorization |
| Frontend HTTP | Auth session and employee query tests | Component rendering, forms, errors, responsive behavior |
| Dashboard | Currency-separation service test | Empty dataset, grouped count accuracy, UI rendering |
| Operations | Build configuration and documented runbook | Seed idempotency, container user, health and direct-route smoke tests |

A feature is complete when its functional requirements and acceptance scenarios are implemented, focused checks pass, documentation matches behavior, and `/speckit-converge` reports no actionable gaps.

## Risks and Mitigations

| Risk | Impact | Current mitigation | Planned response |
| --- | --- | --- | --- |
| Render filesystem reset | Demo edits disappear | Deterministic reseed and explicit warning | Managed PostgreSQL and backups |
| Demo secret or credentials reused | Unauthorized access | External Render secret and documentation | Managed identity and secret rotation |
| JWT in session storage | Token exposed to same-origin script | Short lifetime and session-only persistence | CSP, hardened token strategy, SSO/MFA |
| Cross-currency interpretation | Misleading financial reporting | Separate totals and local-unit labels | Governed rate snapshots and reporting currency |
| Wildcard search growth | Slower employee lookup | Bounded paging and existing indexes | Query-plan-led indexing/search redesign |
| Sequential aggregate queries | Higher dashboard latency | Compact database projections | Measurement-led consolidation or caching |
| SQLite write concurrency | Lock contention and limited scaling | Single-instance demo scope | Managed client/server database |
| Missing audit history | No change traceability | Explicitly excluded from demo | Immutable audit events and retention policy |

## Spec Kit Workflow

For new behavior:

1. Update the constitution only when project-wide principles change.
2. Run `/speckit-specify` with one bounded user outcome.
3. Run `/speckit-clarify` when material ambiguity remains.
4. Run `/speckit-plan` and verify architecture/constitution gates.
5. Run `/speckit-tasks` and `/speckit-analyze`.
6. Run `/speckit-implement` with focused validation after each change.
7. Run `/speckit-converge`; repeat implementation until no gaps remain.

Existing behavior should evolve through its current feature directory instead of creating duplicate specifications.

## Production Readiness Backlog

1. Replace SQLite with managed PostgreSQL and introduce versioned migrations.
2. Replace seeded accounts with managed provisioning, SSO/MFA, and password lifecycle controls.
3. Add immutable audit history for employee and compensation changes.
4. Define token refresh, revocation, and browser security policy.
5. Add controller integration tests and the complete authorization matrix.
6. Add frontend component, accessibility, and responsive-layout tests.
7. Add structured logs, metrics, tracing, alerts, and request correlation.
8. Establish backup, restore, retention, and disaster-recovery procedures.
9. Add vulnerability, dependency, container, and secret scanning to CI.
10. Define exchange-rate governance before normalized global payroll reporting.