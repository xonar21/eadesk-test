---
description: Verify that observability is properly connected across the stack
---

Check the observability setup of the Signal Lab project:

1. **Backend Metrics**: Read `apps/backend/src/metrics/metrics.service.ts` and verify:
   - `scenario_runs_total` counter exists with labels `type`, `status`.
   - `scenario_run_duration_seconds` histogram exists with label `type`.
   - `http_requests_total` counter exists with labels `method`, `path`, `status_code`.

2. **Structured Logging**: Check `apps/backend/src/scenario/scenario.service.ts`:
   - Every scenario handler produces at least 1 structured log.
   - Logs contain `scenarioType`, `scenarioId`, `duration`.

3. **Sentry**: Check `apps/backend/src/main.ts`:
   - Sentry SDK is initialized with `SENTRY_DSN` from env.
   - `system_error` scenario calls `Sentry.captureException`.

4. **Prometheus Config**: Read `infra/prometheus/prometheus.yml`:
   - Backend target is configured: `backend:3001`.

5. **Grafana Dashboard**: Read `infra/grafana/dashboards/signal-lab.json`:
   - At least 3 panels exist (Scenario Runs, Latency, Error Rate).
   - Datasources are configured (Prometheus + Loki).

6. **Docker Compose**: Read `docker-compose.yml`:
   - All services present: postgres, backend, frontend, prometheus, grafana, loki, promtail.

Report any missing or misconfigured observability components.
