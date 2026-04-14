import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { MetricsModule } from './metrics/metrics.module.js';
import { HealthModule } from './health/health.module.js';
import { ScenarioModule } from './scenario/scenario.module.js';
import { HttpMetricsMiddleware } from './middleware/http-metrics.middleware.js';

@Module({
  imports: [PrismaModule, MetricsModule, HealthModule, ScenarioModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*');
  }
}
