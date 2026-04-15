# Upgrade Notes: v2.0.1 → v2.1.0

**Date:** 2026-04-15

## What we did

### 1. Merged upstream through v2.1.0

```bash
git fetch upstream --tags
git merge upstream/main --no-edit
```

Upstream changes included:

- `cecba09` — fix: shell-escape `@file` arguments to handle paths with spaces
- `d362e13` — fix: write long subagent commands to temp script to avoid terminal line-wrap breakage
- `ea2e752` — fix(subagents): persist launch scripts in session artifacts
- `8a9ebdf` — chore(release): v2.1.0

### 2. Preserved local customizations

These local changes are still in place after the merge:

- `/qrspi` custom extension remains registered in `package.json`
- `cmux` workspace rename still uses `pi.setSessionName()` instead of `cmux workspace-action --action rename`
- single-dash session directory delimiters are preserved in both repo code and the local `node_modules` patch

### 3. Patch verification state

Repo patch markers verified after merge:

- `pi-extension/subagents/cmux.ts:179`
- `pi-extension/subagents/cmux.ts:432`
- `pi-extension/subagents/index.ts:26`
- `pi-extension/subagents/index.ts:130`
- `pi-extension/subagents/index.ts:740`
- `pi-extension/subagents/index.ts:890`

Post-install patch marker still expected:

- `node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.js:209`

### 4. Sanity checks

- `npm test` ✅ (30/30 passing)
- verified repo `PATCH(local)` markers ✅
- verified `node_modules` single-dash patch still present ✅

### 5. Housekeeping

- updated `package-lock.json` root package version to `2.1.0`
- updated `MAINTAINING.md` patch-line expectations for the new upstream layout
