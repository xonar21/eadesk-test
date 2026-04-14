# Orchestrator Usage Example

## Starting a New PRD Execution

```
User: /run-prd test-task/prds/002_prd-observability-demo.md
```

The orchestrator will:

1. Create `.execution/2026-04-14-11-30/context.json`
2. Run through all 7 phases
3. Create and delegate atomic tasks
4. Update context file after each phase
5. Generate final report

## Resuming After Interruption

```
User: /run-prd
```

The orchestrator detects existing `.execution/2026-04-14-11-30/context.json` with `status: "in_progress"` and asks:

```
Found interrupted execution from 2026-04-14-11-30:
- PRD: 002_prd-observability-demo.md
- Phase: implementation (5/8 tasks complete)

Resume from current phase? [Y/n]
```

On resume, it skips completed phases and continues from the last incomplete task.

## Example Context File

```json
{
  "executionId": "2026-04-14-11-30",
  "prdPath": "test-task/prds/002_prd-observability-demo.md",
  "status": "completed",
  "currentPhase": "report",
  "phases": {
    "analysis": {
      "status": "completed",
      "result": {
        "requirements": [
          { "id": "F1", "title": "UI Scenario Runner", "priority": "must" },
          { "id": "F2", "title": "Run History", "priority": "must" },
          { "id": "F3", "title": "Observability Links", "priority": "must" },
          { "id": "F4", "title": "Backend Scenario Execution", "priority": "must" },
          { "id": "F5", "title": "Prometheus Metrics", "priority": "must" },
          { "id": "F6", "title": "Structured Logging", "priority": "must" },
          { "id": "F7", "title": "Sentry Integration", "priority": "must" },
          { "id": "F8", "title": "Grafana Dashboard", "priority": "must" },
          { "id": "F9", "title": "Docker Compose Observability", "priority": "must" }
        ]
      }
    },
    "codebase": { "status": "completed" },
    "planning": { "status": "completed" },
    "decomposition": { "status": "completed" },
    "implementation": { "status": "completed", "completedTasks": 11, "totalTasks": 12 },
    "review": { "status": "completed", "passed": true },
    "report": { "status": "completed" }
  },
  "signal": 42,
  "tasks": [
    {
      "id": "task-001",
      "title": "Add ScenarioRun model to Prisma schema",
      "type": "database",
      "complexity": "low",
      "model": "fast",
      "status": "completed",
      "duration": 45
    },
    {
      "id": "task-002",
      "title": "Create RunScenarioDto with validation",
      "type": "backend",
      "complexity": "low",
      "model": "fast",
      "status": "completed",
      "duration": 30
    }
  ]
}
```

## Model Usage Summary

Typical PRD execution breakdown:

| Task Category | Count | Model | % |
|--------------|-------|-------|---|
| Schema & DTOs | 3 | fast | 25% |
| Simple endpoints | 2 | fast | 17% |
| Metrics & logging | 2 | fast | 17% |
| UI components | 2 | fast | 17% |
| Complex integration | 2 | default | 17% |
| Architecture review | 1 | default | 8% |
| **Total** | **12** | | **75% fast / 25% default** |
