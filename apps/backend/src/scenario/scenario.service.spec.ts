import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ScenarioService } from './scenario.service.js';
import { MetricsService } from '../metrics/metrics.service.js';

jest.mock('../prisma/prisma.service.js', () => ({
  PrismaService: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaService } = require('../prisma/prisma.service');

describe('ScenarioService', () => {
  let service: ScenarioService;

  const mockPrisma = {
    scenarioRun: {
      create: jest.fn().mockResolvedValue({
        id: 'test-id',
        type: 'success',
        status: 'completed',
        duration: 10,
        createdAt: new Date(),
      }),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockMetrics = {
    incScenarioRuns: jest.fn(),
    observeDuration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenarioService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MetricsService, useValue: mockMetrics },
      ],
    }).compile();

    service = module.get<ScenarioService>(ScenarioService);
    jest.clearAllMocks();
  });

  describe('runScenario', () => {
    it('should handle success scenario', async () => {
      const result = await service.runScenario('success');
      expect(result).toHaveProperty('id', 'test-id');
      expect(result).toHaveProperty('status', 'completed');
      expect(mockPrisma.scenarioRun.create).toHaveBeenCalled();
      expect(mockMetrics.incScenarioRuns).toHaveBeenCalledWith('success', 'completed');
    });

    it('should throw BadRequestException for validation_error', async () => {
      await expect(service.runScenario('validation_error')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockMetrics.incScenarioRuns).toHaveBeenCalledWith('validation_error', 'error');
      expect(mockPrisma.scenarioRun.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'validation_error',
            status: 'error',
          }),
        }),
      );
    });

    it('should throw InternalServerErrorException for system_error', async () => {
      await expect(service.runScenario('system_error')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockMetrics.incScenarioRuns).toHaveBeenCalledWith('system_error', 'error');
    });

    it('should handle teapot scenario with signal 42', async () => {
      const result = await service.runScenario('teapot');
      expect(result).toHaveProperty('signal', 42);
      expect(result).toHaveProperty('message', "I'm a teapot");
      expect(mockMetrics.incScenarioRuns).toHaveBeenCalledWith('teapot', 'completed');
    });
  });

  describe('getHistory', () => {
    it('should return scenario runs', async () => {
      const result = await service.getHistory();
      expect(Array.isArray(result)).toBe(true);
      expect(mockPrisma.scenarioRun.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    });
  });
});
