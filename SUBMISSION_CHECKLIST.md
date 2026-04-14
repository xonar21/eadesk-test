# Signal Lab - Submission Checklist

## Repository

- URL: `https://github.com/xonar21/eadesk-test`
- Branch: `main`
- Approximate time spent: `~4 hours`

## Run Commands

```bash
# Start
cp .env.example .env
docker compose up -d --build

# Verify
curl http://localhost:3001/api/health

# Stop
docker compose down
```

Prerequisites: Docker Desktop (Linux containers), Docker Compose V2.

## Stack Confirmation

| Technology           |  Used   | Where                                                                                    |
| -------------------- | :-----: | ---------------------------------------------------------------------------------------- |
| Next.js (App Router) |   Yes   | `apps/frontend/app`                                                                      |
| shadcn/ui            |   Yes   | `apps/frontend/components/ui`                                                            |
| Tailwind CSS         |   Yes   | `apps/frontend/app/globals.css`                                                          |
| TanStack Query       |   Yes   | `apps/frontend/components/scenario-form.tsx`, `apps/frontend/components/run-history.tsx` |
| React Hook Form      |   Yes   | `apps/frontend/components/scenario-form.tsx`                                             |
| NestJS               |   Yes   | `apps/backend/src`                                                                       |
| PostgreSQL           |   Yes   | `docker-compose.yml` (`postgres`)                                                        |
| Prisma               |   Yes   | `apps/backend/prisma/schema.prisma`                                                      |
| Sentry               | Partial | Env var present (`SENTRY_DSN`), full runtime capture not finalized                       |
| Prometheus           |   Yes   | `apps/backend/src/metrics`, `infra/prometheus/prometheus.yml`                            |
| Grafana              |   Yes   | `infra/grafana/*`                                                                        |
| Loki                 |   Yes   | `infra/loki/*`, `infra/promtail/*`                                                       |

## Observability Verification

| Signal            | How to reproduce                 | Where to verify                                          |
| ----------------- | -------------------------------- | -------------------------------------------------------- |
| Prometheus metric | Run scenarios in UI              | `http://localhost:3001/metrics`, `http://localhost:9090` |
| Grafana dashboard | Run 3-5 scenarios                | `http://localhost:3100` -> Signal Lab Dashboard          |
| Loki log          | Run any scenario                 | Grafana Explore (Loki): `{app="signal-lab"}`             |
| Sentry exception  | Run `system_error` with real DSN | Sentry project dashboard                                 |

## Cursor AI Layer

### Custom Skills

1. `add-observability`
2. `create-nestjs-endpoint`
3. `create-shadcn-form`
4. `signal-lab-orchestrator`

### Commands

1. `/add-endpoint`
2. `/check-obs`
3. `/run-prd`

### Hooks

1. `after-schema-change`
2. `check-secrets-before-commit`

### Rules

1. `stack-constraints.mdc`
2. `observability-conventions.mdc`
3. `prisma-patterns.mdc`
4. `frontend-patterns.mdc`
5. `error-handling.mdc`

### Marketplace Skills

1. `nextjs-best-practices`
2. `shadcn-ui`
3. `tailwind-css`
4. `nestjs-best-practices`
5. `prisma-orm`
6. `docker-expert`
7. `postgresql-table-design`

## Orchestrator

- Skill path: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- Context file example: `.execution/<timestamp>/context.json`
- Number of phases: `7`
- Fast-model tasks: schema updates, DTOs, simple endpoints, metrics/logging, UI components
- Resume support: `Yes`

## Screenshots / Video

- [x] UI
- [x] Grafana dashboard
- [x] Loki logs
- [ ] Sentry error (requires real DSN)

## What would be improved with +4h

- Finalize full Sentry runtime integration and verify capture in cloud project.
- Add e2e smoke test for UI -> backend -> metrics/logs.
- Add richer Grafana panels and alerting rules.
