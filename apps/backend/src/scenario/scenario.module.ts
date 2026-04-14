import { Module } from '@nestjs/common';
import { ScenarioController } from './scenario.controller.js';
import { ScenarioService } from './scenario.service.js';
import { MetricsModule } from '../metrics/metrics.module.js';

@Module({
  imports: [MetricsModule],
  controllers: [ScenarioController],
  providers: [ScenarioService],
})
export class ScenarioModule {}
