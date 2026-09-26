FROM node:18-alpine AS frontend-build
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM gradle:8.10.2-jdk17 AS backend-build
WORKDIR /workspace/backend
COPY backend/settings.gradle backend/build.gradle ./
RUN gradle dependencies --no-daemon
COPY backend/src ./src
COPY --from=frontend-build /workspace/frontend/dist/acme-salary-management-web/browser ./src/main/resources/static
RUN gradle bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /workspace/backend/build/libs/salary-management-api-0.0.1-SNAPSHOT.jar app.jar
RUN useradd --system --uid 10001 appuser
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
