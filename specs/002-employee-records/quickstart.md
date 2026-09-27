# Quickstart: Employee Records

1. Start the seeded application and sign in as `viewer`.
2. Search by name and employee ID; combine department, country, and active filters.
3. Change page and sort order and confirm the URL request remains bounded.
4. Sign in as `hrmanager`; create a valid employee, then edit it.
5. Submit an invalid email, negative salary, future date, and duplicate email; verify field/conflict feedback.
6. Sign in as `admin`; confirm and delete the created record.

Automated checks:

```powershell
Set-Location backend
.\gradlew.bat test --tests "com.acme.salary.employee.EmployeeServiceTest"
Set-Location ..\frontend
npm test -- --include src/app/core/employee.service.spec.ts
```