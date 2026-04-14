import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ScenarioType } from './dto/run-scenario.dto.js';
import { MetricsService } from '../metrics/metrics.service.js';

@Injectable()
export class ScenarioService {
  private readonly logger = new Logger(ScenarioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async runScenario(type: ScenarioType, name?: string) {
    const start = Date.now();

    try {
      switch (type) {
        case 'success':
          return await this.handleSuccess(start, name);
        case 'validation_error':
          return await this.handleValidationError(start, name);
        case 'system_error':
          return await this.handleSystemError(start);
        case 'slow_request':
          return await this.handleSlowRequest(start, name);
        case 'teapot':
          return await this.handleTeapot(start);
        default:
          throw new BadRequestException(`Unknown scenario type: ${type}`);
      }
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(`Unexpected error in scenario ${type}`, err);
      throw err;
    }
  }

  async getHistory(limit = 20) {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private async handleSuccess(start: number, name?: string) {
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: {
        type: 'success',
        status: 'completed',
        duration,
        metadata: name ? { name } : undefined,
      },
    });

    this.metrics.incScenarioRuns('success', 'completed');
    this.metrics.observeDuration('success', duration / 1000);
    this.logger.log({
      message: 'Scenario completed successfully',
      scenarioType: 'success',
      scenarioId: run.id,
      duration,
    });

    return { id: run.id, status: 'completed', duration };
  }

  private async handleValidationError(start: number, name?: string): Promise<never> {
    const duration = Date.now() - start;
    await this.prisma.scenarioRun.create({
      data: {
        type: 'validation_error',
        status: 'error',
        duration,
        error: 'Validation failed: scenario input is invalid',
        metadata: name ? { name } : undefined,
      },
    });

    this.metrics.incScenarioRuns('validation_error', 'error');
    this.metrics.observeDuration('validation_error', duration / 1000);
    this.logger.warn({
      message: 'Validation error scenario triggered',
      scenarioType: 'validation_error',
      duration,
    });
    throw new BadRequestException(
      'Validation failed: scenario input is invalid',
    );
  }

  private async handleSystemError(start: number): Promise<never> {
    const duration = Date.now() - start;
    await this.prisma.scenarioRun.create({
      data: { type: 'system_error', status: 'error', duration },
    });

    this.metrics.incScenarioRuns('system_error', 'error');
    this.metrics.observeDuration('system_error', duration / 1000);
    this.logger.error({
      message: 'System error scenario triggered',
      scenarioType: 'system_error',
      duration,
      error: 'Intentional system error for observability demo',
    });

    throw new InternalServerErrorException(
      'Internal system failure (intentional)',
    );
  }

  private async handleSlowRequest(start: number, name?: string) {
    const delay = 2000 + Math.random() * 3000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: {
        type: 'slow_request',
        status: 'completed',
        duration,
        metadata: name ? { name } : undefined,
      },
    });

    this.metrics.incScenarioRuns('slow_request', 'completed');
    this.metrics.observeDuration('slow_request', duration / 1000);
    this.logger.warn({
      message: 'Slow request scenario completed',
      scenarioType: 'slow_request',
      scenarioId: run.id,
      duration,
    });

    return { id: run.id, status: 'completed', duration };
  }

  private async handleTeapot(start: number) {
    const duration = Date.now() - start;
    const run = await this.prisma.scenarioRun.create({
      data: {
        type: 'teapot',
        status: 'completed',
        duration,
        metadata: { easter: true },
      },
    });

    this.metrics.incScenarioRuns('teapot', 'completed');
    this.metrics.observeDuration('teapot', duration / 1000);
    this.logger.log({
      message: "I'm a teapot",
      scenarioType: 'teapot',
      scenarioId: run.id,
      duration,
    });

    return { signal: 42, message: "I'm a teapot", id: run.id };
  }
}
