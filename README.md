# Signal Lab — Observability Playground

Signal Lab — приложение для запуска сценариев, генерирующих метрики, логи и ошибки. Нажмите кнопку в UI — увидите результат в Grafana, Loki и Sentry.

## Быстрый старт

### Предусловия

- Docker >= 24.0 и Docker Compose V2
- Node.js >= 20 (для локальной разработки)

### Запуск

```bash
# Скопировать переменные окружения
cp .env.example .env

# Поднять всё одной командой
docker compose up -d
```

### Проверка

| Сервис | URL | Что проверить |
|--------|-----|---------------|
| Frontend (UI) | http://localhost:3000 | Страница Signal Lab с формой |
| Backend API | http://localhost:3001/api/health | `{ "status": "ok" }` |
| Swagger Docs | http://localhost:3001/api/docs | Интерактивная документация API |
| Prometheus Metrics | http://localhost:3001/metrics | Метрики в формате Prometheus |
| Prometheus UI | http://localhost:9090 | Query interface |
| Grafana | http://localhost:3100 | Dashboard (admin/admin) |
| Loki | http://localhost:3101 | Log aggregation API |

### Остановка

```bash
docker compose down
# С удалением данных:
docker compose down -v
```

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | Next.js (App Router), shadcn/ui, Tailwind CSS, TanStack Query, React Hook Form |
| Backend | NestJS, TypeScript strict |
| Database | PostgreSQL 16, Prisma |
| Observability | Prometheus, Grafana, Loki, Promtail, Sentry |
| Infra | Docker Compose |

## Структура проекта

```
signal-lab/
├── apps/
│   ├── frontend/          # Next.js UI
│   │   ├── app/           # Pages и layouts
│   │   ├── components/    # UI-компоненты
│   │   └── lib/           # API-клиент и утилиты
│   └── backend/           # NestJS API
│       ├── src/
│       │   ├── scenario/  # Сценарии (controller, service, DTO)
│       │   ├── metrics/   # Prometheus метрики
│       │   ├── health/    # Health endpoint
│       │   ├── prisma/    # PrismaService
│       │   ├── filters/   # Global exception filter
│       │   └── middleware/ # HTTP metrics middleware
│       └── prisma/        # Schema и миграции
├── infra/
│   ├── prometheus/        # Конфигурация Prometheus
│   ├── grafana/           # Dashboards и datasources
│   ├── loki/              # Конфигурация Loki
│   └── promtail/          # Конфигурация Promtail
├── .cursor/               # Cursor AI Layer
│   ├── rules/             # Stack constraints, conventions
│   ├── skills/            # Custom skills + orchestrator
│   ├── commands/          # CLI commands
│   └── hooks/             # Git hooks и автоматизация
├── docker-compose.yml     # Всё окружение
└── .env.example           # Переменные окружения
```

## Сценарии

| Тип | Что происходит | Сигналы |
|-----|---------------|---------|
| `success` | Успешная обработка, сохранение в PG | log: info, metric: counter+1, histogram: latency |
| `validation_error` | Отклонение невалидного ввода (400) | log: warn, metric: error counter, Sentry: breadcrumb |
| `system_error` | Unhandled exception (500) | log: error, metric: error counter, Sentry: exception |
| `slow_request` | Искусственная задержка 2-5s | log: warn (slow), metric: histogram spike |
| `teapot` | Easter egg (418) | log: info, signal: 42 |

## Verification Walkthrough

1. `docker compose up -d` — все сервисы стартуют.
2. Открыть http://localhost:3000 — UI загружен.
3. Выбрать "Success" → Run → зелёный badge в истории.
4. Выбрать "System Error" → Run → красный badge + toast с ошибкой.
5. Открыть http://localhost:3001/metrics — видеть `scenario_runs_total`.
6. Открыть Grafana http://localhost:3100 → Signal Lab Dashboard.
7. В Grafana → Explore → Loki: `{app="signal-lab"}` → логи.
8. В Sentry → captured exception от system_error.

---

## Cursor AI Layer

### Rules (`.cursor/rules/`)

| Rule | Что фиксирует |
|------|---------------|
| `stack-constraints` | Разрешённые и запрещённые библиотеки |
| `observability-conventions` | Naming метрик, формат логов, когда Sentry |
| `prisma-patterns` | Работа с Prisma: conventions, запреты, миграции |
| `frontend-patterns` | TanStack Query, RHF, shadcn/ui паттерны |
| `error-handling` | Обработка ошибок на backend и frontend |

### Custom Skills (`.cursor/skills/`)

| Skill | Когда использовать |
|-------|-------------------|
| `add-observability` | Добавление метрик, логов и Sentry к endpoint |
| `create-nestjs-endpoint` | Scaffold нового NestJS endpoint с observability |
| `create-shadcn-form` | Создание формы с RHF + TanStack Query + shadcn/ui |
| `signal-lab-orchestrator` | Выполнение PRD через 7-фазный pipeline |

### Commands (`.cursor/commands/`)

| Command | Что делает |
|---------|-----------|
| `/add-endpoint` | Scaffold нового NestJS endpoint |
| `/check-obs` | Проверка observability подключения |
| `/run-prd` | Запуск PRD через orchestrator |

### Hooks

| Hook | Какую проблему решает |
|------|----------------------|
| `after-schema-change` | Напоминание о миграции после изменения Prisma schema |
| `check-secrets-before-commit` | Проверка на hardcoded secrets перед коммитом |

### Marketplace Skills

| Skill | Зачем |
|-------|-------|
| `nextjs-best-practices` | Best practices Next.js App Router |
| `shadcn-ui` | Документация shadcn/ui компонентов |
| `tailwind-css` | Справочник Tailwind CSS v4 |
| `nestjs-best-practices` | Паттерны NestJS |
| `prisma-orm` | Документация Prisma ORM |
| `docker-expert` | Best practices Docker |
| `postgresql-table-design` | Проектирование PostgreSQL схемы |

Custom skills закрывают **специфичную для Signal Lab** интеграцию: MetricsService + structured logging + Sentry в одном workflow, scaffold с нашими conventions, комбинация RHF + TanStack Query + shadcn/ui + наш API.

## Разработка

```bash
# Backend (локально)
cd apps/backend
npm install
npx prisma generate
npm run start:dev

# Frontend (локально)
cd apps/frontend
npm install
npm run dev

# Тесты
cd apps/backend
npm test
```
