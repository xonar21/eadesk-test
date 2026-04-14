import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const SCENARIO_TYPES = [
  'success',
  'validation_error',
  'system_error',
  'slow_request',
  'teapot',
] as const;

export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export class RunScenarioDto {
  @ApiProperty({
    enum: SCENARIO_TYPES,
    description: 'Type of scenario to run',
  })
  @IsIn(SCENARIO_TYPES)
  @IsString()
  type: ScenarioType;

  @ApiPropertyOptional({ description: 'Optional scenario name' })
  @IsOptional()
  @IsString()
  name?: string;
}
