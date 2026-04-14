import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { ScenarioService } from './scenario.service.js';
import { RunScenarioDto } from './dto/run-scenario.dto.js';
import type {} from './dto/run-scenario.dto.js';

@ApiTags('scenarios')
@Controller('api/scenarios')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Post('run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run a scenario' })
  @ApiResponse({ status: 200, description: 'Scenario executed successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 418, description: "I'm a teapot" })
  @ApiResponse({ status: 500, description: 'System error' })
  async run(@Body() dto: RunScenarioDto, @Res() res: Response) {
    const result = await this.scenarioService.runScenario(dto.type, dto.name);

    if (dto.type === 'teapot') {
      return res.status(418).json(result);
    }

    return res.status(200).json(result);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get scenario run history' })
  @ApiResponse({ status: 200, description: 'List of recent scenario runs' })
  async history() {
    return this.scenarioService.getHistory();
  }
}
