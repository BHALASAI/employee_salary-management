# Feature Specification: Operational Delivery

**Feature Branch**: `004-operational-delivery`
**Created**: 2026-09-27
**Status**: Complete
**Input**: Run a repeatable 10,000-employee demo locally and deploy the full stack as one observable container.

## User Scenarios & Testing

### User Story 1 - Start with Representative Data (Priority: P1)

As an evaluator, I can start an empty application and receive deterministic demo users and 10,000 employees so every workflow is immediately demonstrable.

**Why this priority**: The product cannot demonstrate scale or permissions without baseline data.

**Independent Test**: Start against an empty database, verify users/counts, restart, and verify no duplicate employees.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** the service starts, **Then** it creates the three demo roles and exactly 10,000 employees.
2. **Given** the same empty state, **When** seeding runs repeatedly in separate databases, **Then** generated employee values are reproducible.
3. **Given** existing employee rows, **When** the service restarts, **Then** it does not add another employee dataset.
4. **Given** missing demo users and existing employees, **When** startup runs, **Then** only missing demo users are restored.

---

### User Story 2 - Configure and Observe Runtime (Priority: P1)

As an operator, I can configure port, database path, allowed origin, token secret, and token duration externally and use a public health endpoint.

**Independent Test**: Start with environment overrides and verify listener, database file, CORS, token behavior, and health response.

**Acceptance Scenarios**:

1. **Given** environment variables, **When** the service starts, **Then** they override local defaults.
2. **Given** a running service, **When** `/actuator/health` is requested anonymously, **Then** it returns health status.
3. **Given** a shutdown signal, **When** termination begins, **Then** Spring performs graceful shutdown.

---

### User Story 3 - Deploy One Container (Priority: P2)

As an evaluator, I can deploy one Docker service containing the Angular UI and Spring API using the Render blueprint.

**Independent Test**: Build the image, run it as configured, verify non-root execution, health, SPA routes, and login.

**Acceptance Scenarios**:

1. **Given** the repository Dockerfile, **When** an image is built, **Then** Angular assets are packaged into the executable Spring Boot application.
2. **Given** the runtime container, **When** it starts, **Then** the Java process runs as a non-root user and listens on the configured port.
3. **Given** the Render blueprint, **When** deployed with a secret, **Then** health checks use `/actuator/health` and the application is reachable from one origin.
4. **Given** Render free ephemeral storage, **When** the instance is replaced, **Then** data loss is treated as expected demo behavior and the seed can rebuild the baseline.

### Edge Cases

- Seed insertion uses batches of 500.
- Demo user creation is individually idempotent; employee seeding is skipped when any employee exists.
- Render's `/tmp` SQLite database can disappear after restart, redeploy, or replacement.
- A production deployment must not use the checked-in fallback signing secret or demo credentials.
- Frontend direct routes are served through the Spring SPA fallback.

## Requirements

### Functional Requirements

- **FR-001**: An empty database MUST receive exactly 10,000 deterministic employees generated from seed `42`.
- **FR-002**: Employee seed writes MUST be batched in groups of 500.
- **FR-003**: Missing `ADMIN`, `HR_MANAGER`, and `VIEWER` demo users MUST be created with BCrypt passwords.
- **FR-004**: Existing employee data MUST prevent automatic employee reseeding.
- **FR-005**: `PORT`, `DB_PATH`, `CORS_ORIGINS`, `JWT_SECRET`, and `JWT_EXPIRATION_MS` MUST be externally configurable.
- **FR-006**: `/actuator/health` MUST be publicly available for platform probes.
- **FR-007**: The Docker build MUST compile Angular and package its browser assets into Spring Boot static resources.
- **FR-008**: The runtime container MUST run as a non-root user.
- **FR-009**: The Render blueprint MUST declare Docker runtime, health path, CORS origin, database path, and externally supplied JWT secret.
- **FR-010**: Documentation MUST state that Render free local storage is disposable and unsuitable for payroll-of-record data.
- **FR-011**: Production guidance MUST require managed durable storage, managed secrets, migrations, identity hardening, and backups/auditing.

### Key Entities

- **Runtime Configuration**: Environment-overridable server, database, CORS, JWT, and management settings.
- **Seed Dataset**: Three demo identities and 10,000 reproducible employee rows.
- **Container Image**: Built Angular assets plus executable Spring Boot JAR running under an unprivileged account.
- **Render Service**: One Docker web service with health check and environment settings.

## Success Criteria

### Measurable Outcomes

- **SC-001**: First startup on an empty database produces exactly 10,000 employees; restart preserves that count.
- **SC-002**: The container image builds both applications and runs with a numeric non-root UID.
- **SC-003**: The deployed health endpoint returns HTTP 200 when the service is ready.
- **SC-004**: No production deployment requires a secret committed to source control.
- **SC-005**: Operational documentation clearly distinguishes disposable demo storage from production storage.

## Assumptions

- Local/demo SQLite and Hibernate schema update are acceptable only for evaluation.
- The Render free tier may sleep and lose filesystem state.
- High availability, durable production migration, monitoring, backups, and disaster recovery are out of baseline scope.