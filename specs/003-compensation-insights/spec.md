# Feature Specification: Compensation Insights

**Feature Branch**: `003-compensation-insights`
**Created**: 2026-09-27
**Status**: Complete
**Input**: Give HR staff an immediate, currency-safe summary of workforce and compensation data.

## User Scenarios & Testing

### User Story 1 - Review Workforce Overview (Priority: P1)

As an authenticated staff member, I can see total and active headcount plus average base salary and bonus so I can assess the current dataset quickly.

**Why this priority**: Summary figures answer the most common overview questions.

**Independent Test**: Load known records and compare dashboard values with independently calculated counts and averages.

**Acceptance Scenarios**:

1. **Given** employee records, **When** the dashboard loads, **Then** total headcount and active headcount match persisted data.
2. **Given** compensation records, **When** the dashboard loads, **Then** average base salary and bonus are shown as unconverted local currency units.
3. **Given** an empty dataset, **When** summary is requested, **Then** counts and averages return zero without an error.

---

### User Story 2 - Compare Currency Payroll Totals (Priority: P1)

As an HR manager, I can view base salary totals and employee counts by currency without misleading cross-currency addition.

**Independent Test**: Insert records in at least two currencies and verify one independently totaled row per currency.

**Acceptance Scenarios**:

1. **Given** employees in several currencies, **When** summary is requested, **Then** each currency has its own employee count and base salary total.
2. **Given** multiple currencies, **When** the dashboard renders, **Then** it does not display a combined total base payroll.
3. **Given** currency groups, **When** they render, **Then** each group is labeled with its currency code.

---

### User Story 3 - Understand Organization Distribution (Priority: P2)

As an HR manager, I can compare employee counts by department and country so I can understand workforce distribution.

**Independent Test**: Load known department/country combinations and verify grouped counts and descending display proportions.

**Acceptance Scenarios**:

1. **Given** employees across departments, **When** summary is requested, **Then** it returns a count for each department.
2. **Given** employees across countries, **When** summary is requested, **Then** it returns a count for each country.
3. **Given** a summary response, **When** the dashboard renders, **Then** it displays loading, error, key metric, currency, department, and country states responsively.

### Edge Cases

- Empty average database results are normalized to zero.
- Currency totals use decimal arithmetic and are never merged across currency codes.
- Global averages are nominal per-record averages and are explicitly labeled `Local currency units`; they are not exchange-rate-adjusted.
- Zero headcount produces an active rate of `0.0%` and no division error.
- A service failure produces an error state rather than partial or fabricated metrics.

## Requirements

### Functional Requirements

- **FR-001**: The authenticated dashboard summary MUST return total and active headcount.
- **FR-002**: The summary MUST return average base salary and average bonus, defaulting empty values to zero.
- **FR-003**: Unconverted averages MUST be labeled as local currency units in the UI.
- **FR-004**: The summary MUST return employee count and total base salary grouped by currency.
- **FR-005**: The application MUST NOT calculate or display a combined cross-currency payroll total.
- **FR-006**: The summary MUST return headcount grouped by country and department.
- **FR-007**: Aggregations MUST execute in the database rather than loading all employees into application/browser memory.
- **FR-008**: The dashboard MUST show a derived active percentage and relative visual bars without changing source values.
- **FR-009**: The dashboard MUST expose clear loading and failure states.

### Key Entities

- **Dashboard Summary**: Headcounts, unconverted averages, and grouped metrics.
- **Currency Metric**: Currency code, employee count, and base salary total in that currency.
- **Count Metric**: Country or department label and employee count.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Summary counts and aggregates match database queries for the 10,000-record seed.
- **SC-002**: Every payroll total displayed has exactly one currency code.
- **SC-003**: The summary response contains grouped metrics rather than employee-level records.
- **SC-004**: Empty and failed loads produce deterministic zero or error states without browser exceptions.

## Assumptions

- Global averages are useful only as rough nominal indicators and are not comparable monetary totals.
- Exchange rates, historical trends, downloadable reports, and charting libraries are out of scope.
- Dashboard metrics include all employee records unless a metric explicitly states active employees.