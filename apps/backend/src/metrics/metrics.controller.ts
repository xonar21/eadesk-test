import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Response } from 'express';
import { MetricsService } from './metrics.service.js';

@ApiTags('metrics')
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('metrics')
  @ApiExcludeEndpoint()
  async metrics(@Res() res: Response) {
    const metrics = await this.metricsService.getMetrics();
    res.set('Content-Type', this.metricsService.getContentType());
    res.send(metrics);
  }
}
