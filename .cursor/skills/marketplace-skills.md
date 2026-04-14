# Marketplace Skills — Signal Lab

## Подключённые marketplace skills и обоснование

### 1. `nextjs-best-practices`
**Зачем**: Обеспечивает best practices для Next.js App Router — ISR, server components, layouts, route handlers. Покрывает паттерны, которых нет в наших custom skills.

### 2. `shadcn-ui`
**Зачем**: Актуальная документация по компонентам shadcn/ui, их API и паттернам использования. Критически важен при добавлении новых UI-компонентов.

### 3. `tailwind-css`
**Зачем**: Справочник по Tailwind CSS v4 утилитам. Помогает выбрать правильные классы вместо написания custom CSS.

### 4. `nestjs-best-practices`
**Зачем**: Паттерны NestJS — модульная структура, dependency injection, guards, interceptors, pipes. Дополняет наш `create-nestjs-endpoint` skill глубоким знанием фреймворка.

### 5. `prisma-orm`
**Зачем**: Актуальная документация Prisma — миграции, queries, relations, raw access. Дополняет наш `prisma-patterns` rule конкретными API-примерами.

### 6. `docker-expert`
**Зачем**: Best practices для Docker и Docker Compose — multi-stage builds, health checks, networking. Важен для поддержки и расширения нашего `docker-compose.yml`.

### 7. `postgresql-table-design`
**Зачем**: Паттерны проектирования схемы PostgreSQL — индексы, типы данных, нормализация. Полезен при расширении Prisma schema.

## Что закрывают custom skills, чего нет в marketplace

| Custom Skill | Что закрывает |
|-------------|---------------|
| `add-observability` | Специфичный для Signal Lab workflow добавления metrics + logs + Sentry. Marketplace skills не знают нашу конкретную MetricsService и структуру логов. |
| `create-nestjs-endpoint` | Полный scaffold с нашими conventions (DTOs, Swagger, observability, тесты). Generic NestJS skill не знает нашу структуру. |
| `create-shadcn-form` | Интеграция RHF + TanStack Query + shadcn/ui + наш API клиент. Marketplace skills покрывают каждую библиотеку отдельно, но не их комбинацию в нашем проекте. |
