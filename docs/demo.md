# Demo Runbook

## Local prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18.13+ for Angular 17
- npm 9+

## Start the backend

```powershell
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080` and creates `data/salary.db` with 10,000 employees on the first run.

## Start the frontend

```powershell
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

## Demo accounts

- `admin` / `admin123!` - full administrative role
- `hrmanager` / `hrmanager123!` - employee read/write role
- `viewer` / `viewer123!` - read-only role

These credentials are for the assessment demo only and must be replaced outside a local evaluation.

## Suggested walkthrough

1. Sign in as `hrmanager` and show the dashboard totals.
2. Search for an employee by name or ID and filter by country or department.
3. Open an employee, edit the bonus, and save the change.
4. Create a new employee and verify it appears in the list.
5. Sign out and sign in as `viewer`; verify that edit and create controls are unavailable.
6. Use the dashboard currency and department breakdowns to explain how the organization pays people.
