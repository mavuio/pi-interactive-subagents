# Upgrade Notes: v1.6.1 → v1.7.0

**Date:** 2026-04-11

## What we did

### 1. Merged upstream v1.7.0

```bash
git fetch upstream
git merge upstream/main --no-edit
```

Clean merge, no conflicts. Upstream commits included:

- `cbb945c` — fix(subagents): write system prompt to file instead of passing on CLI
- `1144e55` — feat(agents): add `system-prompt: append` to all agent definitions
- `5d2d981` — refactor(spec): strengthen interactive flow with hard rules and per-phase stops
- `fd37778` — refactor(plan): add mandatory scout phase before spec and planner

### 2. Verified local patches survived

All 5 `PATCH(local)` markers survived the merge intact — no re-application needed:

```
pi-extension/subagents/cmux.ts:179   — sessionNameSetter declaration
pi-extension/subagents/cmux.ts:432   — sessionNameSetter?.(title) call
pi-extension/subagents/index.ts:27   — setSessionNameCallback import
pi-extension/subagents/index.ts:700  — setSessionNameCallback wiring in session_start
pi-extension/subagents/index.ts:829  — pi.setSessionName on subagent launch
```

> Note: upstream v1.7.0 reverted these exact patches (switching back to `cmux workspace-action --action rename`). The merge preserved our version since upstream removed code that differed from ours — no conflict, our patches stayed.

### 3. Tests passed

All 30 tests green after merge.

### 4. Applied upstream agent changes to `~/mavu-macbook/pi/agents/`

The user maintains custom agent overrides in `~/mavu-macbook/pi/agents/` with different model settings. We applied the upstream content changes while preserving those overrides:

| File | Changes applied |
|---|---|
| `planner.md` | Added `system-prompt: append` |
| `reviewer.md` | Added `system-prompt: append` |
| `scout.md` | Added `system-prompt: append` |
| `visual-tester.md` | Added `system-prompt: append` |
| `worker.md` | Added `system-prompt: append` |
| `spec.md` | Added `auto-exit: false` + `system-prompt: append`; rewrote rules section with hard rules (Rule 1–4) and ⏸️ per-phase stop markers |

Model overrides preserved as-is (`openai-codex/gpt-5.4`, `openai-codex/gpt-5.4-mini`, `thinking: high`, etc.).
