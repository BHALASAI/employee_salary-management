# ACME Salary Management

## Goal

Give HR managers a reliable web application for maintaining salary data for 10,000 employees across countries and answering common pay questions without spreadsheet work.

## Users and success measures

The primary user is an authenticated HR manager. The product should support:

- Finding an employee quickly by name, employee ID, email, department, country, or job title.
- Reviewing and editing salary records with clear validation.
- Understanding salary distribution by country, department, and currency.
- Safely separating read-only and editing permissions.
- Loading a seeded 10,000-employee dataset without pagination or search becoming unusable.

## In scope for this assessment

- Multi-user authentication with roles: `ADMIN`, `HR_MANAGER`, and `VIEWER`.
- Employee and salary CRUD, including employee identity, organization details, country, currency, base salary, bonus, effective date, and active status.
- Search, filtering, sorting, and server-side pagination.
- Dashboard metrics: headcount, total base payroll, average salary, average bonus, and salary breakdowns by country and department.
- SQLite persistence for local development and demo deployment.
- Deterministic seed data for 10,000 employees plus demo users.
- Responsive Angular UI, Spring Boot REST API, validation, error responses, automated tests, and deployment documentation.

## Deliberately out of scope

- Payroll processing, tax calculation, benefits, payslips, or direct payment integrations: these require country-specific legal and financial rules.
- Spreadsheet import/export: useful later, but it introduces mapping, duplicate, and security concerns before the core workflow is proven.
- Salary approval workflows, audit history, notifications, and SSO: important production capabilities, but larger cross-cutting features than this assessment needs.
- Fine-grained organizational tenancy and localization: ACME is treated as one organization and the first release uses English UI text.

These exclusions keep the assessment focused on the central information-management problem while leaving clear extension points in the API and data model.

## Non-functional goals

The API must validate input, enforce authorization, use parameterized persistence queries, and return stable JSON contracts. List endpoints must be paginated and indexed for the 10,000-employee seed. Tests must be deterministic, fast, and focused on authorization, CRUD validation, filtering, and metrics.

## Key assumptions

Salary values are stored as decimal amounts in each employee's currency. Cross-currency totals are labeled as local-currency totals or counts rather than pretending they are comparable without exchange rates. SQLite is acceptable for this assessment demo; a production deployment should use a persistent managed relational database.
