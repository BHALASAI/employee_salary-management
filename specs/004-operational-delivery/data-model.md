# Data Model: Operational Delivery

## Runtime Configuration

| Environment variable | Local default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | HTTP listener port |
| `DB_PATH` | `salary.db` | SQLite file location |
| `CORS_ORIGINS` | `http://localhost:4200` | Allowed browser origin |
| `JWT_SECRET` | Demo-only fallback | Signing key; external secret required in deployment |
| `JWT_EXPIRATION_MS` | `7200000` | Token lifetime in milliseconds |

## Seed Invariants

- Users: `admin`/`ADMIN`, `hrmanager`/`HR_MANAGER`, `viewer`/`VIEWER`; created only when individually missing.
- Employees: IDs `ACME-00001` through `ACME-10000`; deterministic names, organization fields, country/currency pairing, salaries, bonuses, dates, and active state.
- Employee generation occurs only when the repository count is zero.
- Writes occur in batches of 500 inside one transactional startup runner.

## Deployment State

The Docker image is immutable. SQLite state is external to the image but resides in ephemeral `/tmp` for the Render demo. Replacement may transition the service from edited state back to a newly seeded baseline.