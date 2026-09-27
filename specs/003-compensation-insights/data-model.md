# Data Model: Compensation Insights

## DashboardResponse

| Field | Meaning |
| --- | --- |
| `headcount` | Count of all employee records |
| `activeHeadcount` | Count where active is true |
| `averageBaseSalary` | Nominal average across stored local amounts; zero when empty |
| `averageBonus` | Nominal average across stored local amounts; zero when empty |
| `byCurrency` | Currency-specific salary totals and employee counts |
| `byCountry` | Employee counts by country |
| `byDepartment` | Employee counts by department |

## CurrencyMetricResponse

`currency` is the three-letter code attached to every amount in `totalBaseSalary`; `employeeCount` is the number of records in that group.

## MetricResponse

`label` identifies a country or department and `employeeCount` contains its grouped count.

No dashboard entity is persisted. All values are projections of current employee rows.