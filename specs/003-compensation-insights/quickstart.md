# Quickstart: Compensation Insights

1. Start the seeded application and sign in with any demo role.
2. Open `/dashboard` and verify total and active headcount cards.
3. Confirm average cards are labeled `Local currency units`.
4. Confirm every base salary total appears inside a currency-specific row and no global payroll total appears.
5. Compare department and country counts with filtered employee-list totals.
6. Resize below 600px and verify metrics remain readable without overlap.

Automated check:

```powershell
Set-Location backend
.\gradlew.bat test --tests "com.acme.salary.dashboard.DashboardServiceTest"
```