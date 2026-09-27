# Implementation Plan: Operational Delivery

**Branch**: `004-operational-delivery` | **Date**: 2026-09-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-operational-delivery/spec.md`

## Summary

Create repeatable batched seed data, environment-driven runtime configuration and health probes, then use a multi-stage Docker build and Render blueprint to serve Angular and Spring Boot as one non-root web service.

## Technical Context

**Language/Version**: Java 17, TypeScript 5.5, Dockerfile, YAML
**Primary Dependencies**: Spring Boot 3.5.6 Actuator/JPA, Angular CLI 18.2, Gradle 8.10.2, Node 18
**Storage**: SQLite file; `/tmp/salary.db` on Render free
**Testing**: Gradle/JUnit, Angular build/Karma, Docker build and health smoke check
**Target Platform**: Windows local development and Linux container deployment
**Project Type**: Full-stack web application packaged as one service
**Performance Goals**: Seed 10,000 rows in bounded batches; return one lightweight health response
**Constraints**: Render free filesystem is non-durable; runtime must be non-root
**Scale/Scope**: One demo service and one SQLite database

## Constitution Check

- Runtime and deployment outcomes are observable: PASS.
- Secrets are environment-configurable and demo caveats explicit: PASS.
- Seeded salary data preserves currencies and decimal values: PASS.
- Batch seed and database-backed application satisfy baseline scale: PASS.
- Multi-stage build adds no runtime service boundary: PASS.

## Project Structure

```text
backend/src/main/
├── java/com/acme/salary/seed/DataInitializer.java
└── resources/application.yml
frontend/
├── package.json
└── src/
Dockerfile
render.yaml
docs/render-deployment.md
```

**Structure Decision**: Build each application in its native stage, copy the browser output into Spring static resources, and ship only the JRE plus executable JAR.

## Complexity Tracking

No constitution violations. Ephemeral SQLite is accepted only for the explicitly disposable demo deployment.