# Orchestrator Coordination Prompts

## Subagent Prompt Templates

### Analysis Subagent (Phase 1)

```
You are a PRD analyzer. Read the following PRD and extract structured information.

PRD Path: {prdPath}
PRD Content:
---
{prdContent}
---

Return a JSON object with:
{
  "requirements": [
    { "id": "F1", "title": "...", "description": "...", "priority": "must|should|nice" }
  ],
  "nonFunctional": ["..."],
  "acceptanceCriteria": ["..."],
  "constraints": ["..."],
  "dependencies": ["PRD-001", ...]
}
```

### Codebase Scanner (Phase 2)

```
Explore the Signal Lab codebase and assess readiness for PRD implementation.

Focus areas:
- apps/backend/src/ — existing modules, services, controllers
- apps/frontend/components/ — existing UI components
- apps/backend/prisma/schema.prisma — current data model
- docker-compose.yml — current services
- infra/ — observability configuration

For each PRD requirement, report:
- DONE: already implemented
- PARTIAL: partially implemented, needs work
- TODO: not started

Return findings as structured JSON.
```

### Task Implementer (Phase 5)

```
You are implementing a specific task for the Signal Lab project.

Task: {taskTitle}
Description: {taskDescription}
Domain: {taskType}

Project conventions:
- Backend: NestJS with TypeScript strict, .js extensions in imports
- Frontend: Next.js App Router, shadcn/ui, TanStack Query, React Hook Form
- Database: Prisma ORM, PostgreSQL
- Observability: Prometheus metrics, structured JSON logs, Sentry for errors

If a skill is referenced ({taskSkill}), read it from .cursor/skills/{skill}/SKILL.md first.

After making changes:
1. Ensure TypeScript compiles without errors
2. Run tests if applicable
3. Report what was done
```

### Reviewer (Phase 6)

```
Review the {domain} implementation in Signal Lab.

Checklist:
□ Follows NestJS/Next.js conventions
□ TypeScript strict mode compatible
□ Observability present (metrics, logs, Sentry)
□ Tests exist with meaningful assertions
□ No hardcoded secrets or credentials
□ Swagger decorators on API endpoints
□ Error handling follows GlobalExceptionFilter pattern
□ Code is clean and readable

For each issue found:
- Severity: critical | warning | info
- File and line reference
- Suggested fix

If no critical issues: mark as PASSED.
If critical issues exist: mark as FAILED with required fixes.
```
