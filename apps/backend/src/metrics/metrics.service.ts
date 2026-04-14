import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Registry,
  Counter,
  Histogram,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  readonly registry = new Registry();

  private scenarioRunsTotal: Counter;
  private scenarioRunDuration: Histogram;
  private httpRequestsTotal: Counter;

  onModuleInit() {
    collectDefaultMetrics({ register: this.registry });

    this.scenarioRunsTotal = new Counter({
      name: 'scenario_runs_total',
      help: 'Total number of scenario runs',
      labelNames: ['type', 'status'] as const,
      registers: [this.registry],
    });

    this.scenarioRunDuration = new Histogram({
      name: 'scenario_run_duration_seconds',
      help: 'Duration of scenario runs in seconds',
      labelNames: ['type'] as const,
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'] as const,
      registers: [this.registry],
    });
  }

  incScenarioRuns(type: string, status: string) {
    this.scenarioRunsTotal.inc({ type, status });
  }

  observeDuration(type: string, durationSeconds: number) {
    this.scenarioRunDuration.observe({ type }, durationSeconds);
  }

  incHttpRequests(method: string, path: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method,
      path,
      status_code: statusCode.toString(),
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
