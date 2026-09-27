# Tasks: Employee Records

**Input**: Design documents from `/specs/002-employee-records/`
**Status**: Implemented baseline

## Phase 1: Data and API Foundation

- [x] T001 Define indexed employee persistence in `backend/src/main/java/com/acme/salary/employee/Employee.java`
- [x] T002 Define validated request and stable response DTOs in `backend/src/main/java/com/acme/salary/employee/`
- [x] T003 Define standard page and error contracts in `backend/src/main/java/com/acme/salary/common/`

## Phase 2: User Story 1 - Find Employees

- [x] T004 [US1] Implement composable database search/filter queries in `EmployeeRepository.java`
- [x] T005 [US1] Normalize filters and map results in `EmployeeService.java`
- [x] T006 [US1] Cap and expose pageable requests in `EmployeeController.java`
- [x] T007 [US1] Implement list, search, filters, sort, page, loading, and empty states in `frontend/src/app/pages/employees/employees.component.ts`
- [x] T008 [US1] Verify filter normalization in `EmployeeServiceTest.java`
- [x] T009 [US1] Verify client query parameters in `frontend/src/app/core/employee.service.spec.ts`

## Phase 3: User Story 2 - Create and Edit

- [x] T010 [US2] Implement create/update mapping and uniqueness checks in `EmployeeService.java`
- [x] T011 [US2] Expose authorized create/update endpoints in `EmployeeController.java`
- [x] T012 [US2] Map validation, duplicate, and not-found errors in `GlobalExceptionHandler.java`
- [x] T013 [US2] Implement reusable create/edit form and feedback in `employee-form.component.ts`
- [x] T014 [US2] Verify duplicate rejection and request mapping in `EmployeeServiceTest.java`

## Phase 4: User Story 3 - Delete

- [x] T015 [US3] Implement existence-checked deletion in `EmployeeService.java`
- [x] T016 [US3] Restrict delete endpoint to `ADMIN` in `EmployeeController.java`
- [x] T017 [US3] Implement role-aware confirmation and result feedback in `employees.component.ts`

## Dependencies

T001-T003 precede all stories. Discovery and write stories share the DTO/service foundation but remain independently testable. All baseline tasks are complete and trace to FR-001 through FR-012.