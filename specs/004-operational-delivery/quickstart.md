# Quickstart: Operational Delivery

Local seed verification:

1. Start with an empty local SQLite path.
2. Run the backend and wait for startup completion.
3. Sign in and verify dashboard headcount is 10,000.
4. Restart against the same database and verify headcount remains 10,000.

Container verification:

```powershell
docker build -t acme-salary-management .
docker run --rm -p 8080:8080 -e JWT_SECRET="replace-with-a-long-random-demo-secret" acme-salary-management
```

Verify `http://localhost:8080/actuator/health`, the login page, a direct `/employees` route, and container execution as `appuser`/UID `10001`.

For Render, follow `docs/render-deployment.md`, provide `JWT_SECRET`, and accept that `/tmp/salary.db` can reset.