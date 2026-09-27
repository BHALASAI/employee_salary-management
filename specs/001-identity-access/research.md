# Research: Identity and Access

## Decisions

### Stateless JWT authentication

- **Decision**: Issue a short-lived signed JWT after credential verification.
- **Rationale**: Fits a single REST service and Angular client without server session storage.
- **Alternatives considered**: Stateful sessions add deployment coordination; OAuth/SSO exceeds the demo scope.

### BCrypt password storage

- **Decision**: Use Spring's BCrypt encoder.
- **Rationale**: Adaptive hashing is built into the chosen security stack and avoids custom cryptography.
- **Alternatives considered**: Plain hashes and reversible encryption do not adequately protect credentials.

### Server-authoritative roles

- **Decision**: Enforce permissions with Spring Security route rules and method-level checks; mirror them in the UI only for discoverability.
- **Rationale**: Client controls can be bypassed.
- **Alternatives considered**: UI-only restrictions are not a security boundary.

### Browser session storage

- **Decision**: Keep the JWT and user summary in session storage.
- **Rationale**: Supports refresh within a browser session and limits persistence compared with local storage.
- **Alternatives considered**: HttpOnly cookies provide stronger script isolation but require CSRF and cookie deployment design outside this baseline.