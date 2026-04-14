import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../metrics/metrics.service.js';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const path = req.route?.path || req.path;
      this.metricsService.incHttpRequests(req.method, path, res.statusCode);
    });
    next();
  }
}
