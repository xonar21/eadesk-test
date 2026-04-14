---
description: Scaffold a new NestJS endpoint with full observability
---

Create a new NestJS endpoint following the project conventions:

1. Read the `create-nestjs-endpoint` skill at `.cursor/skills/create-nestjs-endpoint/SKILL.md`.
2. Ask for the domain name and operations needed (if not provided by user).
3. Create the module structure: controller, service, DTO, module file.
4. Register the module in `src/app.module.ts`.
5. Add Prometheus metrics and structured logging per the `add-observability` skill.
6. Add Swagger decorators to all endpoints.
7. Create a unit test file for the service.
8. Run tests to verify: `cd apps/backend && npx jest --passWithNoTests`.

Use `.js` extensions in all TypeScript imports (required for nodenext module resolution).
Use `import type` for type-only imports of `Response` from express.
