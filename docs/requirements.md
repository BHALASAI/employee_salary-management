# ACME Salary Management - Product Requirements

## 1. Purpose

ACME requires a secure web application for maintaining employee identity, organization, and compensation data for approximately 10,000 employees across multiple countries. The application must replace spreadsheet-based maintenance with searchable records, controlled editing, and a concise workforce and compensation dashboard.

This document defines the baseline requirements before implementation. It describes required outcomes and observable behavior without prescribing internal code structure.

## 2. Product Goals

The product must enable authorized staff to:

- Find employees quickly without loading the entire workforce into the browser.
- Create and maintain accurate compensation records with clear validation.
- Review workforce and compensation summaries without combining unlike currencies.
- Separate read, edit, and delete permissions by role.
- Start a representative demonstration environment with 10,000 reproducible records.
- Run locally and as a single deployable web service.

## 3. Users and Permissions

| Role | Intended user | Read | Create | Update | Delete |
| --- | --- | --- | --- | --- | --- |
| `ADMIN` | System or HR administrator | Yes | Yes | Yes | Yes |
| `HR_MANAGER` | HR staff maintaining records | Yes | Yes | Yes | No |
| `VIEWER` | Auditor or read-only stakeholder | Yes | No | No | No |

The API must enforce this matrix. Hiding unavailable interface controls is required for usability but must not be treated as an authorization boundary.

## 4. User Journeys

### 4.1 Sign In and Sign Out

1. A registered, enabled user submits a username and password.
2. Valid credentials establish a time-limited session and open the dashboard.
3. Invalid credentials return a generic failure that does not identify which credential failed.
4. Protected pages redirect unauthenticated users to sign-in.
5. Signing out clears the browser session and prevents further protected access.

### 4.2 Find an Employee

1. An authenticated user opens the employee directory.
2. The user may search by employee ID, first name, last name, email, or job title.
3. The user may combine country, department, and active-status filters.
4. The user may sort and move through bounded result pages.
5. The interface distinguishes loading, no-results, and failure states.

### 4.3 Maintain an Employee Record

1. An administrator or HR manager opens a create or edit form.
2. The application validates all identity, organization, compensation, and date fields.
3. Valid unique data is persisted and a success state is shown.
4. Invalid data produces field-level feedback without partial changes.
5. Duplicate employee IDs or email addresses produce a conflict response.

### 4.4 Delete an Employee

1. An administrator selects an employee for deletion.
2. The interface requests explicit confirmation.
3. Confirmed deletion removes the record and refreshes the directory.
4. Other roles cannot invoke or complete deletion.

### 4.5 Review Compensation Insights

1. An authenticated user opens the dashboard.
2. The dashboard shows total and active headcount and nominal average salary and bonus.
3. Base salary totals are shown separately for each currency.
4. Employee counts are grouped by country and department.
5. Loading, empty, and failure states remain understandable and usable.

## 5. Functional Requirements

### 5.1 Identity and Access

- **AUTH-001**: The system must authenticate provisioned users with username and password.
- **AUTH-002**: Passwords must be stored as adaptive one-way hashes and never returned by an API.
- **AUTH-003**: Successful authentication must return an expiring signed access token, username, and role.
- **AUTH-004**: Missing, malformed, expired, or incorrectly signed tokens must not establish authentication.
- **AUTH-005**: Employee and dashboard APIs must require authentication.
- **AUTH-006**: Sign-in, application assets, and the health endpoint must remain public.
- **AUTH-007**: Operations must follow the role matrix in section 3.
- **AUTH-008**: The browser must attach the access token to protected API requests.
- **AUTH-009**: The browser must guard protected routes and clear session data on sign-out.
- **AUTH-010**: Disabled and unknown accounts must receive the same generic failure as incorrect passwords.

### 5.2 Employee Records

- **EMP-001**: Authenticated users must be able to list and retrieve employee records.
- **EMP-002**: Each record must include employee ID, first name, last name, email, department, job title, country, currency, base salary, bonus, effective date, and active status.
- **EMP-003**: `ADMIN` and `HR_MANAGER` users must be able to create and update records.
- **EMP-004**: Only an `ADMIN` user may delete a record.
- **EMP-005**: Employee ID and email must each be unique.
- **EMP-006**: Search must perform case-insensitive matching over employee ID, first name, last name, email, and job title.
- **EMP-007**: Country, department, and active status must be independently optional and combinable filters.
- **EMP-008**: Blank search and filter values must be treated as absent.
- **EMP-009**: Results must support server-side page, size, and sort parameters.
- **EMP-010**: The default page size must be 25 and no response may contain more than 100 records.
- **EMP-011**: Paged responses must report content, page number, page size, total elements, and total pages.
- **EMP-012**: Unknown employee identifiers must return a not-found response.
- **EMP-013**: Invalid input must return a stable validation response with field-level details.
- **EMP-014**: Duplicate employee ID or email values must return a conflict response.
- **EMP-015**: Create, update, and delete operations must be atomic.

### 5.3 Employee Validation

| Field | Requirement |
| --- | --- |
| Employee ID | Required, unique, maximum 30 characters |
| First name | Required, maximum 80 characters |
| Last name | Required, maximum 80 characters |
| Email | Required, valid email, unique, maximum 160 characters |
| Department | Required, maximum 100 characters |
| Job title | Required, maximum 120 characters |
| Country | Required, maximum 80 characters |
| Currency | Exactly three uppercase letters |
| Base salary | Required, non-negative, maximum 13 integer and 2 fractional digits |
| Bonus | Required, non-negative, maximum 13 integer and 2 fractional digits |
| Effective date | Required and not in the future |
| Active | Required boolean value |

### 5.4 Dashboard and Analytics

- **DASH-001**: The dashboard must return total and active headcount.
- **DASH-002**: It must return average base salary and bonus, with empty results represented as zero.
- **DASH-003**: Nominal averages must be identified as unconverted local-currency units.
- **DASH-004**: It must return employee count and total base salary grouped by currency.
- **DASH-005**: It must not calculate or display a combined cross-currency payroll total.
- **DASH-006**: It must return headcount grouped by country and department.
- **DASH-007**: Aggregations must execute in the persistence layer without loading all employee rows into application or browser memory.
- **DASH-008**: The interface may derive an active percentage and relative bars but must not alter source values.
- **DASH-009**: Service failure must produce an explicit error state rather than partial or fabricated metrics.

### 5.5 Demonstration Data

- **DATA-001**: An empty database must receive exactly 10,000 deterministic employee records.
- **DATA-002**: Generation against separate empty databases must produce equivalent data.
- **DATA-003**: Existing employee data must prevent automatic employee reseeding.
- **DATA-004**: Missing demonstration users for all roles must be restored independently of employee seeding.
- **DATA-005**: Seed insertion must use bounded batches.
- **DATA-006**: Demonstration passwords must be hashed and documented as non-production credentials.

### 5.6 Runtime and Deployment

- **OPS-001**: Server port, database path, allowed origin, token secret, and token lifetime must be externally configurable.
- **OPS-002**: A public health endpoint must report service readiness.
- **OPS-003**: The application must support graceful shutdown.
- **OPS-004**: The Angular application and API must be buildable into one deployable container image.
- **OPS-005**: Production browser routes must resolve through an application fallback.
- **OPS-006**: The runtime container must execute as a non-root user.
- **OPS-007**: Deployment configuration must supply secrets externally.
- **OPS-008**: Documentation must identify demo SQLite storage as disposable and unsuitable for payroll-of-record data.

## 6. API Requirements

Business payloads must use JSON. Protected requests must use a bearer access token.

| Method and path | Required access | Successful result |
| --- | --- | --- |
| `POST /api/auth/login` | Public | Token and user details |
| `GET /api/employees` | Authenticated | Paged employee records |
| `GET /api/employees/{id}` | Authenticated | One employee record |
| `POST /api/employees` | `ADMIN`, `HR_MANAGER` | Created employee record |
| `PUT /api/employees/{id}` | `ADMIN`, `HR_MANAGER` | Updated employee record |
| `DELETE /api/employees/{id}` | `ADMIN` | No-content confirmation |
| `GET /api/dashboard/summary` | Authenticated | Dashboard summary |
| `GET /actuator/health` | Public | Health status |

Errors must use a stable JSON structure containing a timestamp, HTTP status, message, and optional field validation errors. Expected statuses include `400` for invalid input, `401` for failed authentication, `403` for insufficient permission, `404` for missing resources, and `409` for uniqueness conflicts.

## 7. User Experience Requirements

- **UX-001**: The interface must be responsive on desktop and mobile viewports.
- **UX-002**: Navigation and commands must reflect the signed-in user's role.
- **UX-003**: Forms must provide client validation while treating server validation as authoritative.
- **UX-004**: Destructive actions must require confirmation.
- **UX-005**: Views must expose loading, empty, success, and failure states without overlap.
- **UX-006**: Search, filtering, sorting, and pagination must retain predictable state.
- **UX-007**: Authentication rejection must return the user to sign-in without exposing protected data.

## 8. Non-Functional Requirements

### 8.1 Security

- Authorization must be enforced server-side for every protected operation.
- Persistence queries must be parameterized.
- Production secrets and credentials must be supplied through managed configuration.
- Credentials, password hashes, and signing secrets must not appear in responses or logs.
- Cross-origin access must be restricted to configured origins.

### 8.2 Performance and Scale

- The baseline must remain usable with 10,000 employee records.
- Browsing must use database-backed filtering, sorting, and pagination.
- Unique, searchable, and commonly filtered fields must be indexed where appropriate.
- Dashboard summaries must use database aggregates and return grouped metrics.
- Seed generation must be deterministic and use bounded batches.

### 8.3 Reliability and Data Integrity

- Validation failures must not persist partial changes.
- Unique constraints must protect employee ID and email during concurrent writes.
- Empty datasets must return valid empty pages and zero-valued summaries.
- Startup seeding must be idempotent for an existing dataset.
- Production adoption requires durable storage, migrations, backups, monitoring, and audit history.

### 8.4 Testability

- Automated tests must cover authentication, token handling, authorization, validation, uniqueness, filtering, pagination, and aggregation.
- Test data generation must be reproducible.
- API contracts and roles must be independently verifiable without relying on UI visibility.
- Container and health behavior must support automated smoke testing.

## 9. Success Criteria

- **SC-001**: Every protected API request without a valid token is rejected.
- **SC-002**: All roles satisfy the documented permission matrix.
- **SC-003**: Users can locate seeded employees without downloading all 10,000 records.
- **SC-004**: No employee list response contains more than 100 records.
- **SC-005**: Invalid or duplicate writes persist no partial changes.
- **SC-006**: Dashboard values match equivalent database calculations.
- **SC-007**: Every displayed payroll total has exactly one currency.
- **SC-008**: First startup creates exactly 10,000 employees; restart preserves that count.
- **SC-009**: The deployed service reports healthy when ready.
- **SC-010**: No production deployment requires a source-controlled secret.

## 10. Scope Exclusions

The baseline does not include:

- Payroll execution, payments, tax, benefits, payslips, or statutory calculations.
- Currency conversion, exchange-rate management, or consolidated payroll reporting.
- Compensation history, audit trails, approvals, or notifications.
- Employee self-service, registration, password recovery, user administration, MFA, or SSO.
- Spreadsheet import/export, bulk updates, or external HR integrations.
- Multi-tenancy, row ownership, localization, or accessibility certification.
- High availability, horizontal scaling, disaster recovery, or production monitoring.

Future capabilities must not weaken baseline authorization, validation, or currency-safety rules.

## 11. Assumptions and Constraints

- ACME is one organization and employee IDs are globally unique within it.
- English is the initial interface language.
- Salary and bonus are decimal amounts in each employee's stated currency.
- Hard deletion is acceptable for the demonstration baseline.
- SQLite is acceptable only for local development and disposable evaluation.
- Production will use durable managed storage and managed identity and secret services.
- Demonstration accounts are provisioned at startup; public registration is not required.
