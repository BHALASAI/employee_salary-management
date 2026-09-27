# Data Model: Identity and Access

## AppUser

| Field | Rule |
| --- | --- |
| `id` | Database-generated identifier |
| `username` | Required and unique |
| `password` | Required BCrypt hash; never returned |
| `role` | Required enum: `ADMIN`, `HR_MANAGER`, `VIEWER` |
| `enabled` | Required account activation state |

## Authentication DTOs

- **AuthRequest**: Required `username` and `password` strings.
- **AuthResponse**: JWT token and `UserResponse`.
- **UserResponse**: Username and role only.

## State Transitions

1. Anonymous user submits credentials.
2. Enabled identity and BCrypt password are verified.
3. Server signs a JWT containing the username and expiration.
4. Browser stores the token and user summary for the session.
5. Logout removes browser state; expiration or failed signature prevents future API authentication.