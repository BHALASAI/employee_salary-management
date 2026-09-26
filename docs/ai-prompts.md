# AI-Assisted Development Notes

The implementation used AI as a pair-programming accelerator, with the repository requirements treated as the source of truth.

## Prompt themes used

- Convert the assessment into a one-page product scope with explicit exclusions and measurable success criteria.
- Design a Spring Boot and Angular architecture for 10,000 searchable employee salary records.
- Implement role-based JWT authentication, DTO validation, paginated filters, and grouped salary metrics.
- Generate deterministic seed data and tests that do not depend on network services or current time.
- Review the application for authorization gaps, cross-currency reporting mistakes, and deployment risks.
- Produce local and Render runbooks that explain prerequisites and demo credentials without storing secrets.

## Review practice

AI-generated code was kept only after checking its API contract, permission boundary, validation behavior, deterministic seed behavior, and testability. The final repository should be reviewed with a real database and a dependency vulnerability scanner before production use.
