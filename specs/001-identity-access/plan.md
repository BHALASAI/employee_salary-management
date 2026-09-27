# Implementation Plan: Identity and Access

**Branch**: `001-identity-access` | **Date**: 2026-09-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-identity-access/spec.md`

## Summary

Implement stateless username/password authentication with BCrypt and signed JWTs, enforce role rules in Spring Security, and integrate protected Angular routes and bearer-token requests.

## Technical Context

**Language/Version**: Java 17; TypeScript 5.5
**Primary Dependencies**: Spring Boot 3.5.6, Spring Security, JJWT 0.12.6, Angular 18.2, RxJS 7.8
**Storage**: SQLite through Spring Data JPA
**Testing**: JUnit 5, Mockito, Spring Security Test, Jasmine/Karma
**Target Platform**: Modern browsers and a JVM web service
**Project Type**: Full-stack web application
**Performance Goals**: Authentication completes in one request; API authorization adds no extra database query after token validation
**Constraints**: Stateless backend; configurable signing secret; no public registration
**Scale/Scope**: Three baseline roles and three seeded demo identities

## Constitution Check

- Specifications are testable and map to concrete authorization rules: PASS.
- Salary APIs deny anonymous access and enforce permissions server-side: PASS.
- Secrets are externally configurable and passwords are hashed: PASS.
- Existing controller/service/security boundaries are preserved: PASS.
- Focused backend and frontend authentication tests are identified: PASS.

## Project Structure

```text
backend/src/main/java/com/acme/salary/
├── auth/
├── config/SecurityConfig.java
├── security/
└── user/
backend/src/test/java/com/acme/salary/
├── auth/
├── config/
└── security/
frontend/src/app/
├── core/auth.guard.ts
├── core/auth.interceptor.ts
├── core/auth.service.ts
└── pages/login/
```

**Structure Decision**: Keep identity at the existing Spring Security boundary and Angular core services; do not introduce a separate identity service for the baseline.

## Complexity Tracking

No constitution violations.