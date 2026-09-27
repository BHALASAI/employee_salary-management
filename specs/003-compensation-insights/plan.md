# Implementation Plan: Compensation Insights

**Branch**: `003-compensation-insights` | **Date**: 2026-09-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-compensation-insights/spec.md`

## Summary

Compute workforce and compensation metrics through grouped repository projections, map them to a compact summary DTO, and render a responsive Angular dashboard with explicit currency semantics.

## Technical Context

**Language/Version**: Java 17; TypeScript 5.5
**Primary Dependencies**: Spring Boot 3.5.6, Spring Data JPA, Angular 18.2, Angular Material
**Storage**: SQLite aggregate queries over employee data
**Testing**: JUnit 5, Mockito, Jasmine/Karma
**Target Platform**: Browser and JVM web service
**Project Type**: Full-stack web application
**Performance Goals**: One compact summary response for 10,000 employees; no employee-row transfer
**Constraints**: No exchange-rate source; preserve decimal totals by currency
**Scale/Scope**: Organization-wide snapshot across countries, departments, and currencies

## Constitution Check

- Observable dashboard outcomes and edge cases are specified: PASS.
- Summary API requires authentication: PASS.
- Currency totals remain separated; nominal averages are labeled: PASS.
- Aggregations execute through database projections: PASS.
- Repository, service, DTO, and component boundaries are preserved: PASS.

## Project Structure

```text
backend/src/main/java/com/acme/salary/
├── dashboard/
└── employee/EmployeeRepository.java
backend/src/test/java/com/acme/salary/dashboard/
frontend/src/app/
├── core/employee.service.ts
├── core/models.ts
└── pages/dashboard/
```

**Structure Decision**: Keep aggregate query ownership with the employee repository and dashboard orchestration in its own service/API package.

## Complexity Tracking

No constitution violations. Nominal averages are retained as explicitly labeled baseline behavior, not treated as currency-normalized values.