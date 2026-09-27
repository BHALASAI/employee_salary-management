# Performance and Capacity Requirements

## 1. Purpose

The application must remain responsive while maintaining and analyzing a baseline dataset of 10,000 employees. This document defines performance expectations, the design measures used to meet them, known limitations, and the validation approach required before production use.

Performance targets are service objectives for representative environments, not claims about every device or hosting tier. Results must be measured with the environment, dataset, concurrency, and percentile reported.

## 2. Baseline Workload

The initial workload assumes:

- 10,000 employee records in one organization.
- Three authenticated roles with substantially more reads than writes.
- Interactive directory searches, filters, sorting, and pagination.
- Individual employee create, update, and delete operations.
- Dashboard requests containing counts and aggregate compensation metrics.
- One application instance and one SQLite database for local or demonstration use.

The baseline does not represent payroll batch processing, bulk imports, high-frequency writes, multi-tenant isolation, or internet-scale traffic.

## 3. Performance Objectives

The following targets should be verified after warm-up on production-like hardware with 10,000 records:

| Operation | Target at p95 | Conditions |
| --- | --- | --- |
| Authentication | Under 500 ms | Excludes cold start; includes password verification and token creation |
| Employee page retrieval | Under 300 ms | Page size 25, common indexed filter or default listing |
| Employee text search | Under 500 ms | Typical search term with bounded page response |
| Employee create or update | Under 500 ms | Valid request, including uniqueness checks |
| Dashboard summary | Under 750 ms | All counts, averages, currency totals, and grouped metrics |
| Health probe | Under 100 ms | Warm healthy instance |
| Browser route transition | Under 1 second | Warm application, normal network, excluding user think time |

Additional objectives:

- No employee list response may contain more than 100 records.
- Common interactive requests should return payloads measured in kilobytes, not the complete employee dataset.
- Empty and no-result queries should complete within the same order of magnitude as successful queries.
- Sustained requests must not cause unbounded browser or server memory growth.
- First startup seed generation must complete without exhausting the configured application memory.

These objectives must be re-baselined when the database engine, hosting tier, dataset size, or response contract changes.

## 4. Current Performance Design

### 4.1 Bounded Employee Queries

Employee search, filtering, sorting, and pagination execute in the database through Spring Data `Pageable`. The API defaults to 25 records and caps the requested page size at 100. The browser retains only the current page rather than the full employee population.

This keeps response size, JSON serialization, network transfer, and table rendering bounded as the baseline dataset grows.

### 4.2 Database Indexes

The employee table provides unique indexes for employee ID and email and explicit indexes for email, country, department, and active status. These support uniqueness checks and common exact filters.

Index effectiveness must be verified with query plans. Case-insensitive contains search uses expressions and leading wildcards that may prevent ordinary indexes from being used efficiently.

### 4.3 Database-side Aggregation

Dashboard calculations use database aggregate projections for:

- Total employee count.
- Active employee count.
- Average base salary.
- Average bonus.
- Employee count and base salary total by currency.
- Employee count by country.
- Employee count by department.

Only grouped summary rows cross the persistence and HTTP boundaries. The application does not load 10,000 employee records into Java or the browser to calculate dashboard values.

### 4.4 Deterministic Batched Seeding

The startup generator creates 10,000 reproducible employees from a fixed random seed. Application-level writes are submitted in batches of 500, while Hibernate JDBC batching is configured at 100 statements.

This bounds temporary memory and transaction overhead while preserving repeatable demonstration data. Seeding is skipped when employee data already exists.

### 4.5 Browser Rendering

The employee page renders one bounded result page in a compact table. Dashboard rendering consumes grouped metrics rather than raw employee rows. Explicit loading and error states prevent duplicate user actions while a request is pending.

Search is submitted explicitly rather than issuing a request for every keystroke. Sorting currently uses a stable last-name ascending request, limiting query variability.

### 4.6 Deployment Shape

Production packaging serves compiled Angular assets and the Spring API from one container and origin. This removes a cross-service network hop for static application delivery and simplifies browser connection behavior.

The runtime uses a JRE-only stage and a non-root user. These choices reduce image surface but do not by themselves guarantee fast startup or response times.

## 5. Request and Data Flow Budgets

### Employee Directory

1. The browser sends search, filter, page, and size criteria.
2. The API normalizes criteria and caps page size.
3. The database filters, sorts, counts, and returns one page.
4. The API maps only that page to the response contract.
5. The browser replaces the current table rows.

The count query required for total pages is useful for navigation but can become expensive on very large datasets. Cursor pagination is a future option if exact total counts cease to justify their cost.

### Dashboard

The dashboard summary currently performs separate repository operations for totals, averages, and grouped metrics. This is appropriate for the baseline because each query returns a scalar or small grouped result. At larger scale, the number of database round trips and repeated table scans must be measured.

Potential later optimizations include short-lived caching, combined queries, materialized summaries, or an analytics store. These should be introduced only after measurements identify dashboard aggregation as a bottleneck.

## 6. Known Constraints and Bottlenecks

### 6.1 SQLite Concurrency

SQLite is suitable for a single-instance demonstration with modest write activity. Its file-based locking and limited concurrent-write behavior make it unsuitable for a horizontally scaled or write-heavy production workload.

A managed relational database such as PostgreSQL is required before production scaling. Database migration must include dialect testing, connection-pool sizing, query-plan review, and realistic concurrency tests.

### 6.2 Text Search

Case-insensitive contains predicates can require scans because leading wildcard and lowercase expressions reduce normal B-tree index usefulness. This is acceptable at 10,000 records but should be measured at 100,000 and 1,000,000 records.

Possible remedies include normalized search columns, database-native full-text search, prefix-only matching, or a dedicated search index. The selected approach must preserve current search semantics or explicitly version the contract.

### 6.3 Offset Pagination

Offset pagination is simple and supports direct page navigation, but deep pages require the database to skip increasing numbers of rows. Concurrent writes can also shift records between pages.

Cursor pagination should be considered when datasets or write rates make deep-page latency or result stability unacceptable.

### 6.4 Dashboard Recalculation

Every dashboard request recalculates aggregates. This guarantees fresh results but repeats work when many users request the same summary.

Caching may improve throughput, but it introduces staleness and invalidation rules after employee writes. No cache should be added until acceptable staleness and invalidation behavior are defined.

### 6.5 Cold Starts and Ephemeral Hosting

Free Render services may sleep while idle. The first request after sleep includes platform and JVM startup time and is excluded from warm-request targets. The local filesystem may also reset, triggering full seed generation before the application is ready.

Cold-start duration, seed duration, and readiness time must be reported separately from steady-state request latency. Disposable storage is acceptable only for evaluation.

### 6.6 Frontend Bundle and Network Conditions

The first page load includes Angular and Angular Material assets. User-perceived performance depends on bundle size, compression, cache headers, network latency, and client hardware.

Production hosting should enable compression and immutable caching for fingerprinted assets. Bundle budgets and browser performance should be checked during continuous integration.

## 7. Measurement Plan

### 7.1 Test Datasets

Run performance tests against at least:

- 10,000 records for the supported baseline.
- 100,000 records to expose query and pagination growth.
- 1,000,000 records before claiming larger production capacity.

Data must preserve realistic country, department, currency, active-status, name, and salary distributions. Results from an empty or nearly empty database are not representative.

### 7.2 Scenarios

Measure these scenarios independently and as a mixed workload:

- Sign in with valid and invalid credentials.
- Retrieve the first, middle, and deepest practical employee pages.
- Search by selective and common text values.
- Apply each exact filter and representative combinations.
- Create and update unique records.
- Attempt duplicate writes.
- Request the dashboard repeatedly and concurrently.
- Start from an empty database and measure seeding and readiness.
- Load the application on desktop and mobile browser profiles.

### 7.3 Reporting

Every report must include:

- Application version and commit.
- Host CPU, memory, storage, operating system, Java, Node, and database versions.
- Dataset size and distribution.
- Concurrency, request rate, warm-up, and test duration.
- Median, p90, p95, p99, maximum latency, throughput, and error rate.
- Process CPU, memory, garbage collection, database utilization, and connection use.
- Response sizes and frontend transfer, render, and interaction timings.
- Query plans for slow or frequently executed database queries.

Averages alone are insufficient because they conceal tail latency.

## 8. Observability Requirements

Before production use, add:

- Structured request logs with method, route template, status, duration, and correlation identifier.
- Metrics for request latency, throughput, errors, JVM memory, garbage collection, thread use, and database connections.
- Slow-query visibility and query-plan review.
- Dashboards and alerts based on service-level objectives.
- Separate startup, seed, and readiness timing.

Logs and metrics must not expose credentials, access tokens, or employee compensation values.

## 9. Capacity and Scaling Path

Scale only after measurements identify the limiting resource. The expected progression is:

1. Tune queries and indexes using production-like query plans.
2. Replace SQLite with managed PostgreSQL and configure a bounded connection pool.
3. Add application and database resource monitoring.
4. Introduce caching only for measured repeated work with defined staleness.
5. Move static assets to CDN hosting if frontend transfer becomes material.
6. Consider cursor pagination or full-text search as directory scale grows.
7. Add read replicas, materialized summaries, or an analytics pipeline when aggregate demand warrants them.
8. Scale stateless application instances only after shared durable storage and authentication behavior support it.

## 10. Performance Acceptance Criteria

- The 10,000-record baseline meets the warm p95 targets in section 3 under a documented representative load.
- Employee responses remain capped at 100 records and never transfer the complete dataset.
- Dashboard responses contain grouped metrics rather than employee rows.
- Search, filter, sort, and dashboard query plans are reviewed for the target database.
- A 30-minute steady-state mixed workload shows no unbounded memory growth and no unexpected errors.
- Cold-start, seed, and readiness durations are measured separately.
- Performance regressions above 20 percent require investigation before release.
- Production capacity claims are supported by repeatable results, not extrapolated from the Render free tier.
