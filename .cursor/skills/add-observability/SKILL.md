---
name: add-observability
description: Add Prometheus metrics, structured logging, and Sentry integration to a new or existing NestJS endpoint
---

# Add Observability to Endpoint

## When to Use

- You've created a new NestJS controller/service and need to add metrics, logs, and error tracking.
- You're reviewing existing code and notice missing observability signals.
- PRD requires specific metrics or log fields for a feature.

## Prerequisites

- `MetricsService` is available (global module, auto-imported).
- NestJS `Logger` is used for structured logging.
- Sentry SDK is initialized in `main.ts`.

## Steps

### 1. Add Prometheus Metrics

In the relevant service, inject `MetricsService` and add:

```typescript
constructor(
  private readonly metrics: MetricsService,
) {}
```

For each operation, increment counter and observe duration:

```typescript
const start = Date.now();
// ... operation ...
const duration = Date.now() - start;

this.metrics.incScenarioRuns(type, status);
this.metrics.observeDuration(type, duration / 1000);
```

If you need a new metric type, add it to `MetricsService.onModuleInit()` following the naming convention: `snake_case` with domain prefix.

### 2. Add Structured Logging

Use NestJS Logger with object parameters:

```typescript
private readonly logger = new Logger(MyService.name);

this.logger.log({
  message: 'Operation completed',
  operationType: 'xxx',
  operationId: result.id,
  duration,
});

this.logger.error({
  message: 'Operation failed',
  operationType: 'xxx',
  error: error.message,
  duration,
});
```

Log levels:
- `log` / `info` — successful operations
- `warn` — slow operations, validation errors
- `error` — system errors, unexpected failures

### 3. Add Sentry Error Tracking

For error scenarios that should be captured in Sentry:

```typescript
import * as Sentry from '@sentry/node';

Sentry.captureException(error);
```

Only capture real errors (500-level), not validation errors (400-level).

## Verification

After adding observability:
1. Call the endpoint and check `GET /metrics` for new metric values.
2. Check Docker logs for structured JSON log output.
3. For error paths, verify Sentry captures the exception.
