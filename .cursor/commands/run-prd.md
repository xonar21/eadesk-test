---
description: Execute a PRD using the orchestrator skill
---

Run a PRD through the Signal Lab orchestrator:

1. Read the orchestrator skill at `.cursor/skills/signal-lab-orchestrator/SKILL.md`.
2. If a PRD path is provided, use it. Otherwise, ask which PRD to run from `test-task/prds/`.
3. Follow the orchestrator's 7-phase pipeline:
   - Phase 1: PRD Analysis (fast model)
   - Phase 2: Codebase Scan (fast explore)
   - Phase 3: Planning (default model)
   - Phase 4: Decomposition (default model)
   - Phase 5: Implementation (fast 80% / default 20%)
   - Phase 6: Review (fast readonly)
   - Phase 7: Report (fast)
4. Create context file in `.execution/<timestamp>/context.json`.
5. Update context file after each phase.
6. Generate final report.

This command delegates to the orchestrator skill for the actual execution.
