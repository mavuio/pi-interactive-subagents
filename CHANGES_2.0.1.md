# Upgrade Notes: v1.7.0 → v2.0.1

**Date:** 2026-04-13

## What we did

### 1. Merged upstream through v2.0.1

```bash
git fetch upstream --tags
git merge upstream/main --no-edit
```

Upstream changes included:

- `3b0aa15` — feat: auto-detect `PI_CODING_AGENT_DIR` from cwd for config isolation
- `7f0d5dd` — feat(subagents): register `caller_ping` tool
- `b891bde` — feat(subagents): pass `PI_SUBAGENT_SESSION` and `PI_SUBAGENT_SURFACE` to child agents
- `f1d4a9b` — feat(subagents): detect ping file in `onTick` and steer `subagent_ping` message
- `d999217` — feat(subagents): register `subagent_ping` message renderer in parent extension
- `6131532` — refactor(subagents): rework `caller_ping` to exit+resume instead of blocking
- `2c6e122` — feat(subagents): unify exit signaling via `.exit` sidecar file
- `7fccc5d` — fix(subagents): store child sessions in child agent dirs
- `0a91dfd` — chore(release): v2.0.1

### 2. Preserved local customizations

These local changes are still in place after the merge:

- `/qrspi` custom extension remains registered in `package.json`
- `cmux` workspace rename still uses `pi.setSessionName()` instead of `cmux workspace-action --action rename`
- single-dash session directory delimiters are preserved

### 3. Added one new local patch for child session directories

Upstream v2.0.1 introduced `getDefaultSessionDirFor()` in `pi-extension/subagents/index.ts` for subagent session placement.
That helper used double-dash delimiters by default, so we patched it to keep the existing local single-dash convention:

```ts
const safePath = `-${cwd.replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}-`;
```

This patch is now documented in `PATCHES.md` and reflected in `MAINTAINING.md`.

### 4. Patch verification state

Repo patch markers now expected:

- `pi-extension/subagents/cmux.ts:179`
- `pi-extension/subagents/cmux.ts:432`
- `pi-extension/subagents/index.ts:27`
- `pi-extension/subagents/index.ts:131`
- `pi-extension/subagents/index.ts:726`
- `pi-extension/subagents/index.ts:876`

Post-install patch marker still expected:

- `node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.js:209`

### 5. Sanity checks

- `npm test` ✅ (30/30 passing)
- verified repo `PATCH(local)` markers ✅
- verified `node_modules` single-dash patch still present ✅

### 6. Housekeeping

- updated `package-lock.json` root package version to `2.0.1`
