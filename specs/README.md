# SDD Feature Baseline

This directory is the living product contract for the implemented ACME Salary Management application. The baseline was reconciled against source code and tests on 2026-09-27 and follows the Spec Kit workflow.

| ID | Feature | Status | Primary scope |
| --- | --- | --- | --- |
| 001 | [Identity and access](001-identity-access/spec.md) | Complete | Login, JWT sessions, route protection, role authorization |
| 002 | [Employee records](002-employee-records/spec.md) | Complete | CRUD, validation, search, filters, sorting, pagination |
| 003 | [Compensation insights](003-compensation-insights/spec.md) | Complete | Salary fields, currency-safe aggregation, dashboard |
| 004 | [Operational delivery](004-operational-delivery/spec.md) | Complete | Seed data, configuration, health, Docker, Render deployment |

## Traceability

Each feature directory contains `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`, `tasks.md`, and a requirements checklist. Checked tasks identify delivered code and verification already present in the repository. Future changes update the relevant living contract before implementation.

Project-wide decisions are governed by [the constitution](../.specify/memory/constitution.md).