import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service.js';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    service.onModuleInit();
  });

  it('should increment scenario runs counter', () => {
    expect(() => service.incScenarioRuns('success', 'completed')).not.toThrow();
  });

  it('should observe duration', () => {
    expect(() => service.observeDuration('success', 0.5)).not.toThrow();
  });

  it('should increment HTTP requests counter', () => {
    expect(() => service.incHttpRequests('GET', '/api/health', 200)).not.toThrow();
  });

  it('should return metrics string', async () => {
    service.incScenarioRuns('success', 'completed');
    const metrics = await service.getMetrics();
    expect(metrics).toContain('scenario_runs_total');
  });

  it('should return correct content type', () => {
    const contentType = service.getContentType();
    expect(contentType).toContain('text/plain');
  });
});
