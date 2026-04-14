---
name: create-nestjs-endpoint
description: Scaffold a new NestJS endpoint with controller, service, DTO, module, and observability
---

# Create NestJS Endpoint

## When to Use

- You need to add a new REST API endpoint to the backend.
- You're implementing a new feature that requires a new controller/service pair.
- PRD specifies a new API route.

## Steps

### 1. Create the Module Structure

```
apps/backend/src/<domain>/
  <domain>.module.ts
  <domain>.controller.ts
  <domain>.service.ts
  dto/
    <action>-<domain>.dto.ts
```

### 2. Create the DTO

```typescript
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateXxxDto {
  @ApiProperty({ description: '...' })
  @IsString()
  field: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  optionalField?: string;
}
```

### 3. Create the Service

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MetricsService } from '../metrics/metrics.service.js';

@Injectable()
export class XxxService {
  private readonly logger = new Logger(XxxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async create(dto: CreateXxxDto) {
    const start = Date.now();
    const result = await this.prisma.xxx.create({ data: dto });
    const duration = Date.now() - start;

    this.metrics.incXxx('create', 'success');
    this.metrics.observeXxxDuration('create', duration / 1000);
    this.logger.log({ message: 'Created xxx', id: result.id, duration });

    return result;
  }
}
```

### 4. Create the Controller

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('xxx')
@Controller('api/xxx')
export class XxxController {
  constructor(private readonly xxxService: XxxService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create xxx' })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() dto: CreateXxxDto) {
    return this.xxxService.create(dto);
  }
}
```

### 5. Create the Module

```typescript
import { Module } from '@nestjs/common';
import { XxxController } from './xxx.controller.js';
import { XxxService } from './xxx.service.js';
import { MetricsModule } from '../metrics/metrics.module.js';

@Module({
  imports: [MetricsModule],
  controllers: [XxxController],
  providers: [XxxService],
})
export class XxxModule {}
```

### 6. Register in AppModule

Add the new module to `imports` array in `src/app.module.ts`.

### 7. Add Observability

Follow the `add-observability` skill to add metrics, logging, and Sentry integration.

### 8. Write Tests

Create `<domain>.service.spec.ts` with mocked PrismaService and MetricsService.
