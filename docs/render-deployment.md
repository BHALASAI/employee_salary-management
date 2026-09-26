# Render Deployment Runbook

This application deploys as one Docker-based Render web service. The Docker image builds the Angular frontend, packages it into Spring Boot, and serves both from the same origin.

## Before deployment

Confirm that the repository contains:

- `Dockerfile`
- `render.yaml`
- `backend/build.gradle`
- `backend/settings.gradle`
- `frontend/package.json`

The repository must be pushed to GitHub before creating the Render service.

## Option A: Blueprint deployment

1. Sign in to [Render](https://render.com/).
2. Select **New** and then **Blueprint**.
3. Connect the GitHub repository `BHALASAI/employee_salary-management`.
4. Select the branch containing `render.yaml`.
5. Review the service named `acme-salary-management`.
6. Enter a strong random value for the `JWT_SECRET` secret environment variable.
7. Create the Blueprint.

Render reads the Docker service, health check, and environment variables from `render.yaml`.

## Option B: Manual web service

1. Select **New** and then **Web Service**.
2. Connect the GitHub repository.
3. Select **Docker** as the runtime.
4. Set the Dockerfile path to `./Dockerfile`.
5. Set the Docker build context to `.`.
6. Choose the Free plan for assessment evaluation.
7. Add these environment variables:

| Variable | Value |
| --- | --- |
| `JWT_SECRET` | A strong random secret, at least 32 characters |
| `CORS_ORIGINS` | The deployed Render URL, for example `https://acme-salary-management.onrender.com` |
| `DB_PATH` | `/tmp/salary.db` |

8. Set the health check path to `/actuator/health`.
9. Create the web service.

Do not commit `JWT_SECRET` to Git. Render should store it as a secret.

## First deployment

The Docker build performs these steps:

1. Installs frontend dependencies.
2. Builds the Angular application.
3. Resolves Gradle backend dependencies.
4. Builds the Spring Boot executable jar.
5. Copies the Angular browser output into Spring Boot static resources.
6. Starts Spring Boot on Render's `$PORT` value.

The service should become healthy when:

```text
https://YOUR-SERVICE.onrender.com/actuator/health
```

returns HTTP 200 with an `UP` response.

## Open the application

Open the service URL:

```text
https://YOUR-SERVICE.onrender.com
```

The Angular application will route the initial request to the login screen. The Spring Boot SPA fallback also supports direct navigation to `/dashboard` and `/employees`.

## Demo accounts

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `admin123!` | Read, create, edit, delete |
| `hrmanager` | `hrmanager123!` | Read, create, edit |
| `viewer` | `viewer123!` | Read-only |

Change or remove these seeded credentials before using the application with real data.

## SQLite limitation on Render Free

The deployment uses SQLite at `/tmp/salary.db` to keep the assessment simple. Render free web-service filesystems are not durable storage. Data can be lost after a redeploy, restart, or instance replacement. The seed runner recreates the users and 10,000 employees when the database is empty.

This is acceptable for a disposable assessment demo only. For production:

- Replace SQLite with a managed PostgreSQL database.
- Set a production database connection URL through Render secrets.
- Add database migrations instead of relying on Hibernate `ddl-auto: update`.
- Move user provisioning to an SSO or managed identity system.
- Add audit history and backup/restore procedures.

## Troubleshooting

### Build fails during `npm install`

Check Render's build logs and verify that the registry is reachable. Retry the deploy after a transient registry failure.

### Health check fails

Check that the service is using the root Docker context and that the application uses Render's `PORT` variable. The Spring Boot configuration defaults to port 8080 locally but honors `$PORT` in Render.

### CORS errors in the browser

Set `CORS_ORIGINS` to the exact deployed HTTPS origin without a trailing slash, then redeploy.

### Login fails after a restart

If SQLite was reset, the seed runner should recreate the demo users. Check startup logs for the seed process and confirm the `JWT_SECRET` value is present.

### Render service sleeps

The Free plan may sleep when idle. The first request after inactivity can take longer while the service wakes up.

## Deployment checklist

- [ ] Push the latest commits to GitHub.
- [ ] Create the Render Blueprint or Docker web service.
- [ ] Set `JWT_SECRET` as a secret.
- [ ] Set `CORS_ORIGINS` to the actual Render URL.
- [ ] Set `DB_PATH=/tmp/salary.db` for the assessment demo.
- [ ] Confirm `/actuator/health` returns HTTP 200.
- [ ] Sign in as `hrmanager`.
- [ ] Confirm dashboard headcount is 10,000.
- [ ] Test employee search and edit permissions.
- [ ] Record the demo using `docs/demo.md`.
