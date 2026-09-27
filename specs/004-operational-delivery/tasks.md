# Tasks: Operational Delivery

**Input**: Design documents from `/specs/004-operational-delivery/`
**Status**: Implemented baseline

## Phase 1: User Story 1 - Representative Data

- [x] T001 [US1] Define deterministic employee dimensions and random seed in `backend/src/main/java/com/acme/salary/seed/DataInitializer.java`
- [x] T002 [US1] Create missing BCrypt demo users by role in `DataInitializer.java`
- [x] T003 [US1] Generate exactly 10,000 employees only for an empty repository in `DataInitializer.java`
- [x] T004 [US1] Persist seed employees in batches of 500 in `DataInitializer.java`

## Phase 2: User Story 2 - Configure and Observe Runtime

- [x] T005 [US2] Externalize port, database, CORS, JWT, and management settings in `backend/src/main/resources/application.yml`
- [x] T006 [US2] Enable graceful shutdown and health probes in `application.yml`
- [x] T007 [US2] Permit anonymous health checks while protecting business APIs in `SecurityConfig.java`

## Phase 3: User Story 3 - Deploy One Container

- [x] T008 [US3] Build Angular assets in the frontend Docker stage in `Dockerfile`
- [x] T009 [US3] Package static assets into the Spring executable JAR in `Dockerfile`
- [x] T010 [US3] Run the final image as UID `10001` in `Dockerfile`
- [x] T011 [US3] Declare Render service, health path, and environment contract in `render.yaml`
- [x] T012 [US3] Document deployment, secrets, health, and ephemeral storage in `docs/render-deployment.md`

## Dependencies

Seed and runtime configuration are independently testable. The Docker build depends on both application builds; Render deployment depends on the image and health contract. All baseline tasks are complete and trace to FR-001 through FR-011.