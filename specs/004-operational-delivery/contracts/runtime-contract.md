# Runtime Contract

## Health

`GET /actuator/health` is anonymous and returns HTTP 200 with status `UP` when the application is ready. Render uses this path as its health check.

## Process

- The service binds to `${PORT:8080}`.
- Graceful shutdown is enabled.
- The runtime command is `java -jar app.jar`.
- The runtime user is the unprivileged numeric UID `10001`.

## Static Application

The Angular browser build is packaged under Spring Boot static resources. `/`, `/login`, `/dashboard`, `/employees`, and employee form routes resolve through the SPA fallback while `/api/**` and `/actuator/**` retain server handling.

## Persistence

The JDBC URL is `jdbc:sqlite:${DB_PATH:salary.db}`. The Render baseline sets `DB_PATH=/tmp/salary.db`; this location has no durability guarantee.

## Secrets

Render MUST provide `JWT_SECRET` as a non-synchronized secret. The demo fallback MUST NOT be used with real data.