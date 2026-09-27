# Tasks: Compensation Insights

**Input**: Design documents from `/specs/003-compensation-insights/`
**Status**: Implemented baseline

## Phase 1: Aggregation Foundation

- [x] T001 Define count and currency projection interfaces in `backend/src/main/java/com/acme/salary/employee/EmployeeRepository.java`
- [x] T002 Define dashboard response DTOs in `backend/src/main/java/com/acme/salary/dashboard/`

## Phase 2: User Story 1 - Workforce Overview

- [x] T003 [US1] Implement total, active, and average repository queries in `EmployeeRepository.java`
- [x] T004 [US1] Normalize empty averages and assemble summary in `DashboardService.java`
- [x] T005 [US1] Render key metrics and active percentage in `frontend/src/app/pages/dashboard/dashboard.component.ts`

## Phase 3: User Story 2 - Currency Payroll Totals

- [x] T006 [US2] Implement grouped currency count and salary query in `EmployeeRepository.java`
- [x] T007 [US2] Map currency projections without conversion in `DashboardService.java`
- [x] T008 [US2] Render explicitly labeled currency rows in `dashboard.component.ts`
- [x] T009 [US2] Verify currencies remain separate in `backend/src/test/java/com/acme/salary/dashboard/DashboardServiceTest.java`

## Phase 4: User Story 3 - Organization Distribution

- [x] T010 [US3] Implement grouped country and department count queries in `EmployeeRepository.java`
- [x] T011 [US3] Expose authenticated summary in `DashboardController.java`
- [x] T012 [US3] Render responsive department and country metrics plus loading/error states in `dashboard.component.ts`

## Dependencies

T001-T002 precede all stories. Each metric group is independently queryable and displayable after the response foundation. All baseline tasks are complete and trace to FR-001 through FR-009.