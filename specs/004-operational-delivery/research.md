# Research: Operational Delivery

## Decisions

### Deterministic conditional seed

- **Decision**: Seed users if missing and seed employees only when the employee table is empty, using random seed `42` and batches of 500.
- **Rationale**: Gives repeatable demonstrations without duplicating data on normal restarts.
- **Alternatives considered**: Always reseeding destroys edits; migrations with fixture imports add tooling beyond demo needs.

### Environment-first configuration

- **Decision**: Supply local defaults with environment overrides for deployment-sensitive settings.
- **Rationale**: Keeps one artifact portable while allowing platforms to own secrets and endpoints.

### One deployable image

- **Decision**: Build Angular and Spring Boot in separate stages, then serve the SPA from Spring.
- **Rationale**: Simplifies assessment deployment and removes cross-origin complexity in production.
- **Alternatives considered**: Separate frontend/backend services add routing and deployment overhead.

### Disposable Render storage

- **Decision**: Use `/tmp/salary.db` only for free-tier evaluation and document data loss.
- **Rationale**: Meets zero-cost demo constraints without pretending to provide durable payroll storage.
- **Alternatives considered**: Managed PostgreSQL is the required production direction but outside the baseline deployment.