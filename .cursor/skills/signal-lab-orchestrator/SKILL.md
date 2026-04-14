---
name: signal-lab-orchestrator
description: PRD execution orchestrator — breaks PRDs into atomic tasks, delegates to subagents, manages state and model selection
---

# Signal Lab PRD Orchestrator

## When to Use

- You need to implement a PRD from `test-task/prds/`.
- You want to break down a large feature into manageable, atomic tasks.
- You want to delegate work to fast/small models where possible.
- You need to resume interrupted work from where it left off.

## Overview

This orchestrator follows a 7-phase pipeline:

```
PRD → Analysis → Codebase Scan → Planning → Decomposition → Implementation → Review → Report
```

Each phase uses the appropriate model (fast or default) and persists state in a context file for resumability.

## Phase Pipeline

### Phase 1: PRD Analysis (fast model)

**Goal**: Extract requirements, features, and constraints from the PRD.

**Subagent prompt template**:
```
Read the PRD at {prdPath}. Extract and return:
1. List of functional requirements (F1, F2, ...) with brief descriptions
2. Non-functional requirements
3. Acceptance criteria
4. Technology constraints
5. Dependencies on other PRDs

Return as structured JSON.
```

**Model**: `fast` — straightforward text extraction, no complex reasoning needed.

### Phase 2: Codebase Scan (fast, explore)

**Goal**: Understand current project state relevant to the PRD.

**Subagent prompt template**:
```
Explore the codebase at C:\job\eadesk-test and answer:
1. Which parts of the PRD requirements already exist?
2. What is the current file structure?
3. What modules/services are already implemented?
4. What gaps need to be filled?

Focus on: {relevantDirectories}
```

**Model**: `fast` with `subagent_type: explore` — read-only scan, no changes needed.

### Phase 3: Planning (default model)

**Goal**: Create a high-level implementation plan.

**Subagent prompt template**:
```
Given the PRD analysis: {analysisResult}
And the codebase state: {codebaseResult}

Create an implementation plan:
1. Ordered list of work streams (database, backend, frontend, infra)
2. Dependencies between streams
3. Risks and mitigation strategies
4. Estimated complexity per stream
```

**Model**: `default` — requires architectural reasoning and trade-off analysis.

### Phase 4: Decomposition (default model)

**Goal**: Break plan into atomic, implementable tasks.

**Subagent prompt template**:
```
Given the plan: {planResult}

Decompose into atomic tasks. Each task must:
- Be completable in 5-10 minutes
- Have a clear description (1-3 sentences)
- Be tagged with: domain (database|backend|frontend|infra), complexity (low|medium|high), recommended model (fast|default)
- List dependencies on other tasks

Task format:
{
  "id": "task-001",
  "title": "...",
  "description": "...",
  "type": "database|backend|frontend|infra",
  "complexity": "low|medium|high",
  "model": "fast|default",
  "dependencies": ["task-xxx"],
  "skill": "create-nestjs-endpoint|add-observability|create-shadcn-form|null"
}

Model selection guidelines:
- fast (80%+ of tasks): schema changes, DTOs, simple endpoints, metrics, logs, UI components
- default (20%): architecture decisions, complex integrations, multi-system coordination
```

**Model**: `default` — requires understanding of dependencies and complexity assessment.

### Phase 5: Implementation (fast 80% / default 20%)

**Goal**: Execute tasks in dependency order.

For each task group (tasks with resolved dependencies):

1. Read current `context.json` to get task details.
2. Select model based on task's `model` field.
3. Create subagent with task-specific prompt:

```
You are implementing task {taskId}: {taskTitle}

Description: {taskDescription}
Domain: {taskType}
Skill to use: {taskSkill} (read from .cursor/skills/{skill}/SKILL.md if specified)

Project context:
- Backend: apps/backend/ (NestJS)
- Frontend: apps/frontend/ (Next.js)
- Prisma schema: apps/backend/prisma/schema.prisma

Requirements:
{taskDescription}

Follow the project conventions from .cursor/rules/.
After implementation, run tests: cd apps/backend && npx jest --passWithNoTests
```

4. Collect result and update `context.json`.

### Phase 6: Review (fast, readonly)

**Goal**: Verify implementation quality.

For each domain (database, backend, frontend):

```
Review the implementation for domain: {domain}

Check:
1. Code follows project conventions (.cursor/rules/)
2. Observability is in place (metrics, logs, Sentry for errors)
3. Tests exist and pass
4. No hardcoded secrets or TODO placeholders
5. Swagger documentation is present for API endpoints

Report issues found. If critical, flag for re-implementation.
```

**Model**: `fast` with `readonly: true` — read-only verification, no changes.

**Retry loop**: If review fails, re-run implementer (up to 3 attempts), then mark as failed and continue.

### Phase 7: Report (fast)

**Goal**: Generate final execution summary.

```
Generate a summary report for PRD execution:
- Execution ID: {executionId}
- Total tasks: {totalTasks}
- Completed: {completedCount}
- Failed: {failedCount}
- Retries: {retryCount}
- Model usage: {fastCount} fast, {defaultCount} default
- Duration: {totalDuration}

List completed tasks with checkmarks and failed tasks with details.
Suggest next steps for any incomplete work.
```

## Context File

The orchestrator creates and maintains `.execution/<timestamp>/context.json`:

```json
{
  "executionId": "2026-04-14-11-30",
  "prdPath": "test-task/prds/002_prd-observability-demo.md",
  "status": "in_progress",
  "currentPhase": "implementation",
  "phases": {
    "analysis": { "status": "completed", "result": "..." },
    "codebase": { "status": "completed", "result": "..." },
    "planning": { "status": "completed", "result": "..." },
    "decomposition": { "status": "completed", "result": "..." },
    "implementation": { "status": "in_progress", "completedTasks": 5, "totalTasks": 8 },
    "review": { "status": "pending" },
    "report": { "status": "pending" }
  },
  "signal": 42,
  "tasks": []
}
```

## Resume Support

On startup, the orchestrator:
1. Checks for existing `.execution/*/context.json` files.
2. If found with `status: "in_progress"`, offers to resume.
3. Skips completed phases, continues from `currentPhase`.
4. Failed tasks are marked but don't block other tasks.

## Model Selection Logic

| Task Type | Complexity | Model | Reasoning |
|-----------|-----------|-------|-----------|
| Add Prisma field | low | fast | Simple schema edit |
| Create DTO | low | fast | Boilerplate with validation |
| Simple endpoint | low | fast | Follow template |
| Add metric/log | low | fast | Standard pattern |
| UI component | low-medium | fast | Follow shadcn patterns |
| Architecture plan | high | default | Trade-off analysis needed |
| Multi-service integration | high | default | Cross-cutting concerns |
| Review with feedback | medium | fast (readonly) | Pattern matching |

## Integration with Other Skills

The orchestrator references and delegates to:
- `add-observability` — for tasks tagged with observability
- `create-nestjs-endpoint` — for new backend endpoints
- `create-shadcn-form` — for new frontend forms
- Stack constraints from `.cursor/rules/` — enforced in all tasks

## Execution Example

```
> /run-prd test-task/prds/002_prd-observability-demo.md

Signal Lab Orchestrator — Starting

Phase 1: PRD Analysis... ✓ (fast, 15s)
Phase 2: Codebase Scan... ✓ (fast/explore, 20s)
Phase 3: Planning... ✓ (default, 30s)
Phase 4: Decomposition... ✓ (default, 25s)
  → 12 tasks created (9 fast, 3 default)

Phase 5: Implementation...
  [1/12] ✓ Add ScenarioRun model (fast, 45s)
  [2/12] ✓ Create RunScenarioDto (fast, 30s)
  [3/12] ✓ Create ScenarioService (fast, 60s)
  [4/12] ✓ Create ScenarioController (fast, 45s)
  [5/12] ✓ Add Prometheus metrics (fast, 40s)
  [6/12] ✓ Add structured logging (fast, 35s)
  [7/12] ✓ Sentry integration (default, 50s)
  [8/12] ✓ Frontend scenario form (fast, 60s)
  [9/12] ✓ Run history list (fast, 50s)
  [10/12] ✓ Grafana dashboard JSON (fast, 45s)
  [11/12] ✓ Docker Compose observability (default, 60s)
  [12/12] ✗ Loki log panel (failed after 3 retries)

Phase 6: Review... ✓ (fast/readonly, 40s)
Phase 7: Report... ✓ (fast, 15s)

Signal Lab PRD Execution — Complete
Tasks: 11 completed, 1 failed, 2 retries
Duration: ~8 min
Model usage: 9 fast, 3 default
```
