# Architecture Trade-offs and Decisions

## Purpose

This document records the principal choices for the ACME Salary Management baseline, the alternatives considered, and the consequences accepted. The decisions optimize for a secure, reviewable assessment that demonstrates realistic behavior with 10,000 employee records while remaining simple to run locally and deploy as one service.

## 1. Modular Monolith Over Distributed Services

**Decision:** Use an Angular frontend and Spring Boot backend packaged as one runtime service, with behavior separated into feature areas and backend packages.

**Why:** Identity, employee, and dashboard features share one data model and transaction boundary. A modular monolith minimizes deployment, networking, observability, and consistency overhead while preserving internal ownership boundaries.

**Alternatives considered:** Independent frontend and backend services, or domain microservices.

**Consequences:** Deployment and local setup are simpler, and employee writes remain transactional. Components cannot scale independently, and future service extraction will require explicit contracts and data ownership changes.

## 2. Angular Material Over a Custom Component System

**Decision:** Use Angular Material for forms, tables, navigation, dialogs, and responsive controls.

**Why:** This is an operational HR tool where consistency, accessibility primitives, and delivery speed matter more than a bespoke visual system.

**Alternatives considered:** Custom SCSS components or another component library.

**Consequences:** Common interaction and validation patterns are available quickly. The application inherits Material conventions and bundle cost; deeper branding would require a deliberate theme and extension strategy.

## 3. SQLite and JPA for the Demonstration

**Decision:** Persist relational data in SQLite through Spring Data JPA and Hibernate.

**Why:** SQLite is portable, requires no separate database service, and is sufficient for a single-instance demonstration. JPA keeps domain code largely independent of SQLite-specific APIs.

**Alternatives considered:** PostgreSQL from the outset, an in-memory database, or JSON files.

**Consequences:** Local startup is easy and data survives local restarts. SQLite has limited concurrent-write behavior and cannot safely support horizontally scaled instances with separate files. Production requires a managed relational database, migrations, backups, and connection-pool tuning. JPA reduces but does not eliminate migration work because SQL dialects differ.

## 4. Automatic Schema Update Over Versioned Migrations

**Decision:** Allow Hibernate to update the demonstration schema automatically.

**Why:** This removes migration setup from a short-lived assessment and makes an empty database usable on first startup.

**Alternatives considered:** Flyway or Liquibase migrations.

**Consequences:** Demo setup has fewer steps, but schema evolution is not reviewable, repeatable, or rollback-safe enough for production. Versioned migrations are required before persistent business data is accepted.

## 5. JWT Bearer Authentication Over Server Sessions

**Decision:** Issue signed, expiring JWT access tokens and authenticate protected API calls with bearer headers.

**Why:** Stateless tokens keep the browser/API contract explicit and avoid server-side session storage. They fit the combined deployment while allowing the frontend and API to be separated later.

**Alternatives considered:** Server-managed sessions, OAuth2/OIDC, or enterprise SSO.

**Consequences:** API instances do not share session state, but logout cannot revoke an issued token. Secret rotation, refresh tokens, revocation, MFA, and centralized identity are absent. Production should use an organization identity provider and shorter-lived credentials.

## 6. Session Storage Over Persistent or Cookie Storage

**Decision:** Store demonstration session details in browser `sessionStorage`.

**Why:** The session survives refreshes but normally ends when the browser session closes, limiting persistence on shared evaluation machines.

**Alternatives considered:** `localStorage`, memory-only tokens, or secure `HttpOnly` same-site cookies.

**Consequences:** Session storage is straightforward but readable by JavaScript, so cross-site scripting could expose the token. Production should use a hardened cookie-based or established browser authentication flow with strong content security controls.

## 7. Seeded Roles Without User Administration

**Decision:** Provision `ADMIN`, `HR_MANAGER`, and `VIEWER` as deterministic demo identities.

**Why:** Three roles demonstrate the complete authorization matrix without turning the assessment into an identity-management product.

**Alternatives considered:** One unrestricted account, public registration, or full user administration.

**Consequences:** Authorization is immediately testable, but account lifecycle, password reset, audit, lockout, MFA, and delegated administration are absent. Demo credentials and fallback secrets must never become production defaults.

## 8. Server Authorization Plus Role-aware UI

**Decision:** Enforce permissions in Spring Security and hide unavailable commands in Angular.

**Why:** Backend enforcement supplies the security boundary; frontend role awareness prevents users from entering workflows they cannot complete.

**Alternatives considered:** UI-only restrictions or backend-only restrictions.

**Consequences:** Direct API calls remain protected and the interface is clearer. The role model exists in two layers, so authorization tests must verify the backend independently of UI behavior.

## 9. Server-side Search, Sorting, and Pagination

**Decision:** Execute search, filtering, sorting, and pagination in the database, with a default page size of 25 and maximum of 100.

**Why:** Downloading 10,000 rows would increase latency, memory use, and rendering cost. Bounded responses create a clear optimization boundary.

**Alternatives considered:** Client-side filtering, cursor pagination, or a dedicated search engine.

**Consequences:** Payload and browser performance remain predictable. Offset paging may degrade under much larger or frequently changing datasets. Case-insensitive contains searches can limit index use; later scale may require normalized search columns, database text search, cursor pagination, or a search service.

## 10. Database Aggregation Over Client-side Analytics

**Decision:** Calculate counts, averages, currency totals, and distributions with database aggregate queries.

**Why:** Aggregation near the data transfers only summary rows and avoids loading all employees into Java or the browser.

**Alternatives considered:** Browser reduction, application-memory aggregation, or a separate analytics store.

**Consequences:** The dashboard is efficient at the target scale and responses stay small. Multiple queries create database round trips, and real-time calculation may become expensive as data grows. Caching, materialized views, or an analytics pipeline may later be appropriate.

## 11. Currency-separated Totals Over Conversion

**Decision:** Group base salary totals by currency and never add different currencies together. Global averages are labeled as unconverted local-currency units.

**Why:** Cross-currency addition without exchange-rate date, source, reporting currency, and rounding rules is misleading.

**Alternatives considered:** Treat all amounts as equivalent, use live rates, or use a fixed conversion table.

**Consequences:** Every payroll total remains interpretable, but consolidated cost questions cannot be answered. Production reporting requires rate snapshots, compensation history, a reporting currency, rounding policy, and auditability. Nominal global averages remain rough indicators rather than comparable monetary measures.

## 12. Deterministic Startup Seed Over External Fixtures

**Decision:** Generate 10,000 employees from a fixed seed and insert them in batches when no employee records exist.

**Why:** Every evaluator receives representative, reproducible data without importing a large fixture file. Batching bounds memory and persistence overhead.

**Alternatives considered:** SQL or CSV fixtures, random data per run, or a separate import command.

**Consequences:** Demonstrations and tests are repeatable. Empty startup performs extra work, and any existing employee suppresses reseeding rather than repairing a partial dataset. Production must disable demo seeding and use controlled imports or migrations.

## 13. Hard Delete Over Soft Delete and History

**Decision:** Administrators permanently delete employee records after explicit confirmation.

**Why:** Hard deletion provides a complete CRUD baseline with minimal data and query complexity.

**Alternatives considered:** Soft-delete flags, immutable history, or approval-based archival.

**Consequences:** Behavior is simple, but deleted data cannot be restored and change history is unavailable. Real compensation systems generally require audit events, retention rules, archival, and possibly dual approval.

## 14. API Validation Plus Database Constraints

**Decision:** Validate requests at the API boundary and enforce key uniqueness rules in the database.

**Why:** API validation provides actionable field feedback, while database constraints remain authoritative during concurrent writes.

**Alternatives considered:** Client-only or database-only validation.

**Consequences:** Invalid requests fail early and uniqueness remains protected. Rules appear in the Angular form, Java validation, service logic, and schema, so contract tests are needed to prevent drift.

## 15. One Container Over Separate Frontend Hosting

**Decision:** Build Angular assets and package them into the Spring Boot image.

**Why:** One origin avoids production CORS complexity and one service is easier to deploy and inspect.

**Alternatives considered:** Static CDN hosting plus a separate API service.

**Consequences:** Deployment and browser routing are simple, but frontend-only releases rebuild the backend image and assets do not receive independent CDN scaling. Separate hosting becomes attractive when release cadence or global delivery matters.

## 16. Multi-stage Non-root Container

**Decision:** Compile frontend and backend in build stages, then run only the packaged application on a JRE as an unprivileged user.

**Why:** Build tools and source stay out of the runtime image, while non-root execution limits the impact of a compromise.

**Alternatives considered:** A full JDK build image at runtime or root execution.

**Consequences:** The runtime image is smaller and safer, but builds perform all compilation work and SQLite needs a correctly writable path. Dependency caching and supply-chain scanning remain separate concerns.

## 17. Ephemeral Render Storage for Evaluation

**Decision:** Place the Render demonstration database on instance-local temporary storage and rebuild the seed when storage is lost.

**Why:** This supports a zero-infrastructure evaluation deployment within free-service constraints.

**Alternatives considered:** A persistent disk or managed PostgreSQL.

**Consequences:** Restart, redeployment, or replacement may erase edits. This is acceptable only for disposable data and must be disclosed. Payroll-of-record use requires durable storage, backups, migrations, monitoring, and recovery procedures.

## 18. Focused Tests Over Full End-to-End Coverage

**Decision:** Prioritize deterministic service and HTTP-client tests for authentication, token behavior, employee rules, filtering, and dashboard calculations.

**Why:** These tests cover the highest-risk domain and contract logic quickly within assessment scope.

**Alternatives considered:** Broad browser, container, authorization-matrix, and performance suites from the outset.

**Consequences:** Core logic receives fast feedback, but deployment wiring, responsive rendering, complete controller authorization, seed idempotency, and browser workflows retain risk. These suites should be added before production release or major expansion.

## Production Readiness Boundary

The baseline is a demonstration system, not a payroll system of record. Production adoption requires, at minimum:

- Durable managed storage, versioned migrations, and tested backups.
- Enterprise identity, MFA or SSO, account lifecycle management, and revocation.
- Managed secrets, key rotation, secure browser sessions, and security monitoring.
- Immutable audit history, retention controls, and recovery procedures.
- Rate limiting, observability, alerting, vulnerability scanning, and dependency governance.
- Broader authorization, integration, browser, accessibility, performance, and container tests.
- Defined exchange-rate and compensation-history policies before consolidated reporting.
