# Tasks: Identity and Access

**Input**: Design documents from `/specs/001-identity-access/`
**Status**: Implemented baseline

## Phase 1: Identity Foundation

- [x] T001 Define `AppUser` and `Role` persistence in `backend/src/main/java/com/acme/salary/user/`
- [x] T002 Configure BCrypt and stateless request security in `backend/src/main/java/com/acme/salary/config/SecurityConfig.java`
- [x] T003 Implement JWT creation and validation in `backend/src/main/java/com/acme/salary/security/`

## Phase 2: User Story 1 - Sign In Securely

- [x] T004 [US1] Define login request/response contracts in `backend/src/main/java/com/acme/salary/auth/`
- [x] T005 [US1] Implement credential authentication and token issue in `backend/src/main/java/com/acme/salary/auth/AuthService.java`
- [x] T006 [US1] Expose `POST /api/auth/login` in `backend/src/main/java/com/acme/salary/auth/AuthController.java`
- [x] T007 [US1] Implement the login experience in `frontend/src/app/pages/login/login.component.ts`
- [x] T008 [US1] Verify token issue in `backend/src/test/java/com/acme/salary/auth/AuthServiceTest.java`

## Phase 3: User Story 2 - Maintain a Session

- [x] T009 [US2] Persist and clear browser session state in `frontend/src/app/core/auth.service.ts`
- [x] T010 [US2] Guard protected routes in `frontend/src/app/core/auth.guard.ts`
- [x] T011 [US2] Attach bearer tokens in `frontend/src/app/core/auth.interceptor.ts`
- [x] T012 [US2] Verify browser login state in `frontend/src/app/core/auth.service.spec.ts`
- [x] T013 [US2] Verify JWT subject round-trip in `backend/src/test/java/com/acme/salary/security/JwtServiceTest.java`

## Phase 4: User Story 3 - Enforce Roles

- [x] T014 [US3] Require authentication for employee and dashboard APIs in `backend/src/main/java/com/acme/salary/config/SecurityConfig.java`
- [x] T015 [US3] Restrict create/update to `ADMIN` and `HR_MANAGER` in `backend/src/main/java/com/acme/salary/employee/EmployeeController.java`
- [x] T016 [US3] Restrict delete to `ADMIN` in `backend/src/main/java/com/acme/salary/employee/EmployeeController.java`
- [x] T017 [US3] Hide unauthorized controls in employee Angular components
- [x] T018 [US3] Verify public SPA and protected API behavior in `backend/src/test/java/com/acme/salary/config/SecurityConfigTest.java`

## Dependencies

T001-T003 precede login and authorization stories. US2 and US3 can proceed after token issue is available. All baseline tasks are complete and trace to FR-001 through FR-010.