# ACME Salary Management

A full-stack assessment solution for an HR manager maintaining salary data for 10,000 employees across countries.

## What is included

- Angular 18 + Angular Material responsive HR portal.
- Spring Boot 3.3 REST API with SQLite, JPA, validation, JWT authentication, and role-based authorization.
- Deterministic seed runner for 10,000 employees and three demo roles.
- Search, filters, server-side pagination, create/edit/delete workflows, dashboard metrics, and currency-separated payroll views.
- Unit tests for backend domain services and frontend HTTP services.
- Product, architecture, trade-off, AI workflow, performance, and demo artifacts in `docs/`.

## Roles

| User | Password | Access |
| --- | --- | --- |
| `admin` | `admin123!` | Read, create, edit, delete |
| `hrmanager` | `hrmanager123!` | Read, create, edit |
| `viewer` | `viewer123!` | Read-only |

Demo credentials are intentionally simple and must not be used in production.

## Local development

Prerequisites: Java 17+, Gradle 8.10+, Node.js 18.13+, and npm 9+.

```powershell
cd backend
gradle bootRun
```

In another terminal:

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The first backend start creates `backend/salary.db` and seeds 10,000 employees.

Run tests:

```powershell
cd backend
gradle test
cd ../frontend
npm test
```

## Render deployment

The root `Dockerfile` builds Angular and packages it into Spring Boot, so the application deploys as one Render web service. Create a Render service from the repository or use `render.yaml`, set a strong `JWT_SECRET`, and use `/actuator/health` as the health check.

The free service uses SQLite at `/tmp/salary.db`, which is suitable for evaluation but can reset when the service is restarted or redeployed. For real payroll data, replace SQLite with managed PostgreSQL and use a persistent secret store.

## Assessment artifacts

- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Trade-offs](docs/tradeoffs.md)
- [AI-assisted development notes](docs/ai-prompts.md)
- [Performance considerations](docs/performance.md)
- [Demo runbook](docs/demo.md)
