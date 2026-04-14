# Signal Lab — План реализации

## Фаза 1: Platform Foundation (PRD 001)

- [x] 1.1 Инициализация NestJS backend (`apps/backend`)
- [x] 1.2 Инициализация Next.js frontend (`apps/frontend`)
- [x] 1.3 Prisma schema с моделью `ScenarioRun` + миграция
- [x] 1.4 Backend: health endpoint, POST /api/scenarios/run, global exception filter, Swagger
- [x] 1.5 Frontend: базовая страница, React Hook Form, TanStack Query, shadcn/ui компоненты
- [x] 1.6 Docker Compose: frontend + backend + PostgreSQL
- [x] 1.7 `.env.example`, README с инструкциями запуска

## Фаза 2: Observability Demo (PRD 002)

- [x] 2.1 Backend: полная реализация 5 типов сценариев (success, validation_error, system_error, slow_request, teapot)
- [x] 2.2 Backend: Prometheus метрики (`scenario_runs_total`, `scenario_run_duration_seconds`, `http_requests_total`)
- [x] 2.3 Backend: Structured logging в JSON для Loki
- [x] 2.4 Backend: Sentry интеграция (SDK init, SENTRY_DSN from env)
- [x] 2.5 Frontend: полная форма Scenario Runner (RHF + TanStack Query mutation)
- [x] 2.6 Frontend: Run History (список последних 20 запусков с auto-refresh)
- [x] 2.7 Frontend: Observability Links блок
- [x] 2.8 Docker Compose: Prometheus + Grafana + Loki + Promtail
- [x] 2.9 Grafana: provisioned dashboard (4 панели: Runs by Type, Latency, Error Rate, Logs)

## Фаза 3: Cursor AI Layer (PRD 003)

- [x] 3.1 Rules: stack-constraints, observability-conventions, prisma-patterns, frontend-patterns, error-handling
- [x] 3.2 Custom Skills: add-observability, create-nestjs-endpoint, create-shadcn-form
- [x] 3.3 Commands: /add-endpoint, /check-obs, /run-prd
- [x] 3.4 Hooks: after-schema-change, check-secrets-before-commit
- [x] 3.5 Marketplace Skills: 7 skills с обоснованием

## Фаза 4: Orchestrator (PRD 004)

- [x] 4.1 Orchestrator skill: SKILL.md с 7 фазами
- [x] 4.2 COORDINATION.md с промптами для subagents
- [x] 4.3 EXAMPLE.md с примером использования и context file

## Фаза 5: Документация

- [x] 5.1 README.md: запуск, проверка, остановка, описание AI-слоя
- [x] 5.2 SUBMISSION_CHECKLIST.md: заполнен
- [x] 5.3 PLAN.md: обновлён
