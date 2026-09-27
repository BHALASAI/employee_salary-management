# Quickstart: Identity and Access

1. Start the backend and frontend using the repository README.
2. Open `http://localhost:4200/login`.
3. Sign in as `viewer` / `viewer123!` and verify dashboard and employee read access with no edit/delete controls.
4. Sign in as `hrmanager` / `hrmanager123!` and verify create/edit access with no delete control.
5. Sign in as `admin` / `admin123!` and verify full CRUD access.
6. Sign out and confirm a protected route redirects to login.

Automated checks:

```powershell
Set-Location backend
.\gradlew.bat test --tests "com.acme.salary.auth.*" --tests "com.acme.salary.security.*" --tests "com.acme.salary.config.SecurityConfigTest"
Set-Location ..\frontend
npm test -- --include src/app/core/auth.service.spec.ts
```