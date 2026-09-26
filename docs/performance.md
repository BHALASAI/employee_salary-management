# Performance Considerations

- Employee lists use database-side filtering and `Pageable`; the UI requests only one page at a time.
- Searchable columns are indexed where SQLite benefits from them: employee ID, email, country, department, and active status.
- Dashboard metrics are grouped database projections rather than a 10,000-row client-side reduction.
- Seed data is deterministic and inserted in batches so local setup is repeatable.
- The API defaults to 25 rows per page and caps page size at 100.
- Browser rendering uses a compact table and avoids retaining all employee records in client state.
- For a production database, add query-plan checks, connection pooling, structured request timing, and load tests with at least 10,000 and 100,000 records.
- Render free services may sleep when idle and their local filesystem may reset. This demo is therefore suitable for evaluation, not payroll-of-record storage.
