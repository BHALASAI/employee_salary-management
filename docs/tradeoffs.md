# Trade-offs and Decisions

## SQLite for the assessment

SQLite is simple, relational, portable, and satisfies the assessment with almost no setup. Its main weakness is hosted persistence: free web-service filesystems can be ephemeral, and SQLite is not the right choice for concurrent production writes. The code keeps persistence behind JPA so a managed PostgreSQL database can replace it later.

## JWT instead of server sessions

A stateless token keeps the Angular and Spring Boot deployments independent and works cleanly with Render services. Tokens are stored in browser session storage for this demo. A production system should consider secure same-site cookies, refresh-token rotation, SSO, and centralized secret management.

## Roles without a user-management screen

Three seeded roles demonstrate authorization without expanding the assessment into an identity-admin product. User provisioning and audit trails are deliberately left as follow-up work.

## Salary analytics and currencies

The application groups payroll by currency rather than adding EUR, USD, INR, and other amounts together. It also exposes average numeric salary as a local-unit indicator. A production analytics layer would need exchange-rate snapshots, effective-date history, and explicit reporting currency.

## Server-side pagination

The UI never downloads all 10,000 employees. Search, filters, sorting, and pagination are performed by the API, which keeps the browser responsive and gives the database a clear optimization boundary.
