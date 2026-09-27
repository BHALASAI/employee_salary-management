# Feature Specification: Identity and Access

**Feature Branch**: `001-identity-access`
**Created**: 2026-09-27
**Status**: Complete
**Input**: Secure access for administrators, HR managers, and read-only viewers.

## User Scenarios & Testing

### User Story 1 - Sign In Securely (Priority: P1)

As a registered staff member, I can sign in with my username and password so that I can access salary information permitted by my role.

**Why this priority**: No salary feature may be available before identity is established.

**Independent Test**: Submit valid and invalid credentials to the login endpoint and verify that only valid credentials produce a usable session.

**Acceptance Scenarios**:

1. **Given** an enabled user with valid credentials, **When** the user signs in, **Then** the system returns a JWT and the user's username and role.
2. **Given** invalid credentials, **When** sign-in is attempted, **Then** the system returns `401` without revealing which credential failed.
3. **Given** a successful browser sign-in, **When** the response arrives, **Then** the client stores the session and routes the user to the dashboard.

---

### User Story 2 - Maintain an Authenticated Session (Priority: P1)

As a signed-in user, I can navigate protected pages and make API requests without signing in again until my token expires or I sign out.

**Independent Test**: Navigate directly to a protected route before and after login, then inspect the authorization header on an API call.

**Acceptance Scenarios**:

1. **Given** no valid session, **When** a protected route is opened, **Then** the client redirects to login.
2. **Given** a stored token, **When** the client calls the API, **Then** it sends `Authorization: Bearer <token>`.
3. **Given** a signed-in user, **When** the user signs out, **Then** stored session data is removed and protected pages become inaccessible.

---

### User Story 3 - Enforce Role Permissions (Priority: P1)

As an organization, access is constrained by role so viewers cannot alter records and only administrators can delete them.

**Independent Test**: Call read, write, and delete endpoints with tokens for each role and compare status codes to the permission matrix.

**Acceptance Scenarios**:

1. **Given** any authenticated role, **When** employee or dashboard data is requested, **Then** read access is allowed.
2. **Given** an `ADMIN` or `HR_MANAGER`, **When** an employee is created or updated, **Then** the operation is allowed.
3. **Given** a `VIEWER`, **When** a write is attempted, **Then** the API returns `403`.
4. **Given** a non-`ADMIN`, **When** deletion is attempted, **Then** the API returns `403`.

### Edge Cases

- Disabled or unknown users receive the same generic authentication failure as an incorrect password.
- Missing, malformed, expired, or incorrectly signed tokens do not establish authentication.
- Browser controls hidden by role do not replace server-side authorization.
- A refresh restores only a syntactically stored session; the API remains authoritative on token validity.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST authenticate seeded users with username and password.
- **FR-002**: Passwords MUST be stored as BCrypt hashes.
- **FR-003**: Successful authentication MUST return a signed, expiring JWT plus username and role.
- **FR-004**: All `/api/employees/**` and `/api/dashboard/**` endpoints MUST require authentication.
- **FR-005**: The login endpoint, SPA assets, and health endpoint MUST remain public.
- **FR-006**: `ADMIN`, `HR_MANAGER`, and `VIEWER` MUST all have read access.
- **FR-007**: Only `ADMIN` and `HR_MANAGER` MUST create or update employee records.
- **FR-008**: Only `ADMIN` MUST delete employee records.
- **FR-009**: The Angular client MUST guard protected routes and attach the bearer token to API requests.
- **FR-010**: Signing out MUST clear client-side authentication state.

### Key Entities

- **AppUser**: A staff identity with username, password hash, role, and enabled state.
- **Role**: One of `ADMIN`, `HR_MANAGER`, or `VIEWER`, controlling API permissions.
- **Session**: Client-held JWT and non-sensitive user details used until logout or expiration.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Valid demo users can reach the dashboard after one successful login request.
- **SC-002**: Every protected API request without a valid token is rejected.
- **SC-003**: The three roles satisfy the documented read/write/delete matrix in automated authorization checks.
- **SC-004**: No plaintext password or signing secret appears in an API response or application log.

## Assumptions

- Accounts are provisioned by seed/configuration; registration and password recovery are out of scope.
- The browser session uses session storage and ends when explicitly cleared or the browser session closes.
- JWT revocation, SSO, MFA, and user administration are future features.