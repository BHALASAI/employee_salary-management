# Spec Kit AI Prompt Record

This project uses GitHub Spec Kit to keep requirements, design decisions, implementation tasks, and verification traceable. The governing rules live in `.specify/memory/constitution.md`; completed feature artifacts live under `specs/`.

The prompts below reconstruct the implemented baseline as living SDD contracts. Process one feature directory at a time because downstream Spec Kit commands use `.specify/feature.json` to identify the active feature.

## Project Constitution

```text
/speckit-constitution Establish principles for specification traceability, backend-enforced salary-data security, decimal and currency integrity, database-side pagination and aggregation, automated delivery evidence, direct Angular/Spring architecture, externally managed production secrets, and explicit demo-versus-production boundaries.
```

## Feature 001: Identity and Access

```text
/speckit-specify Build secure staff authentication and role-based access. Support seeded ADMIN, HR_MANAGER, and VIEWER users; BCrypt passwords; expiring JWTs; protected Angular routes; bearer-token API calls; logout; read access for every role; create/update for ADMIN and HR_MANAGER; and delete only for ADMIN. Exclude registration, password recovery, MFA, SSO, and user administration. SPECIFY_FEATURE_DIRECTORY=specs/001-identity-access

/speckit-clarify Resolve authentication failure behavior, session lifetime, public routes, and the exact role permission matrix without expanding baseline scope.

/speckit-plan Use Java 17, Spring Boot 3.5, Spring Security, JJWT, SQLite/JPA, Angular 18, session storage, route guards, and an HTTP interceptor. Preserve stateless backend sessions and existing auth, security, user, and Angular core boundaries.

/speckit-tasks Include focused JUnit and Jasmine tests for login, JWT subject validation, protected APIs, browser session persistence, and role authorization.

/speckit-analyze
/speckit-implement
/speckit-converge
```

## Feature 002: Employee Records

```text
/speckit-specify Build employee record discovery and maintenance for 10,000 records. Authenticated users can search employee ID, name, email, and job title; combine country, department, and active filters; sort and page results; and view one record. ADMIN and HR_MANAGER can create and edit; only ADMIN can delete. Validate uniqueness, required fields, email, uppercase three-letter currency, non-negative two-decimal compensation, and past-or-present effective dates. Include loading, empty, confirmation, validation, success, and error states. Exclude bulk import/export, history, approvals, and soft deletion. SPECIFY_FEATURE_DIRECTORY=specs/002-employee-records

/speckit-clarify Resolve pagination bounds, searchable fields, duplicate conflict behavior, delete confirmation, and validation limits from the existing product requirements.

/speckit-plan Use Spring Data JPA database-side queries, request/response DTOs, Jakarta Validation, centralized API errors, Angular Material standalone pages, and server-side pagination capped at 100. Preserve controller-service-repository boundaries and stable JSON contracts.

/speckit-tasks Include service and HTTP-client tests for duplicate rejection, request mapping, filter normalization, query parameters, pagination, and authorization boundaries.

/speckit-analyze
/speckit-implement
/speckit-converge
```

## Feature 003: Compensation Insights

```text
/speckit-specify Build an authenticated workforce dashboard showing total and active headcount, nominal average base salary and bonus labeled as local currency units, base salary totals and employee counts separated by currency, and headcount grouped by country and department. Never display a combined cross-currency payroll total. Include responsive loading, error, empty-data, and zero-headcount behavior. Exclude exchange-rate conversion, historical trends, exports, and external chart libraries. SPECIFY_FEATURE_DIRECTORY=specs/003-compensation-insights

/speckit-clarify Resolve metric populations, empty-dataset defaults, cross-currency labeling, sorting, and visualization semantics without implying currency normalization.

/speckit-plan Use grouped Spring Data repository projections and a compact dashboard response. Aggregate in SQLite, map through a dashboard service, and render lightweight CSS bars in the Angular dashboard without transferring employee-level rows.

/speckit-tasks Include tests proving currency totals remain separate, empty averages become zero, grouped counts are mapped correctly, and dashboard loading/error states are deterministic.

/speckit-analyze
/speckit-implement
/speckit-converge
```

## Feature 004: Operational Delivery

```text
/speckit-specify Build a repeatable local and Render demo environment. Seed missing demo users and exactly 10,000 deterministic employees into an empty database in batches of 500; avoid duplicate seeding; externalize port, SQLite path, CORS origins, JWT secret, and token lifetime; expose a public health probe; package Angular and Spring Boot into one non-root Docker image; and document Render free-tier storage as disposable. Exclude production high availability, backups, disaster recovery, managed identity, and durable database migration. SPECIFY_FEATURE_DIRECTORY=specs/004-operational-delivery

/speckit-clarify Resolve seed idempotency, environment defaults, health readiness, container privilege, secret handling, and demo-storage limitations.

/speckit-plan Use Java 17, Angular 18, Gradle 8.10.2, Node 18, Spring Boot Actuator, SQLite, a multi-stage Dockerfile, UID 10001, and a Render Docker blueprint with /actuator/health. Keep production-hardening guidance explicit and separate from demo guarantees.

/speckit-tasks Include deterministic seed checks, restart/idempotency verification, frontend and backend builds, container non-root inspection, health smoke tests, direct SPA-route checks, and Render configuration review.

/speckit-analyze
/speckit-implement
/speckit-converge
```

## Review and Evolution

Use these prompts when behavior changes:

```text
/speckit-checklist Generate a requirements-quality checklist covering acceptance scenarios, security boundaries, validation, currency semantics, performance, and operational limits.

/speckit-analyze Check the active feature's specification, plan, contracts, data model, quickstart, and tasks for contradictions, missing traceability, and constitution violations.

/speckit-converge Compare the active feature artifacts with the current code and append only concrete remaining work to tasks.md.
```

AI output is accepted only after its API contracts, permission boundaries, validation behavior, monetary semantics, deterministic seeding, and focused tests are reviewed. Production adoption additionally requires a durable managed database, secret management, vulnerability scanning, migrations, audit history, backup/restore procedures, and production identity controls.
