# Upgrade Notes: v2.2.0 → v3.0.0

**Date:** 2026-04-17

## What we did

### 1. Fetched and merged upstream through v3.0.0

```bash
git fetch upstream --prune --tags
git merge upstream/main
```

Upstream changes included:

- `251a8d9` — refactor(subagents): remove `set_tab_title` tool
- `c1023b3` — feat(subagents): add `disable-model-invocation` and `session-mode`
- `d5a95a7` — chore(subagents): remove stray dead constant from `session.ts`
- `793d606` — refactor: remove `session-artifacts` extension
- `8240909` — docs(agents): migrate artifact conventions to path-based instructions
- `1e8691e` — docs(agents): unify artifact path format to `.pi/plans/YYYY-MM-DD-<name>/`
- `b1b5078` — chore(release): v3.0.0

### 2. Preserved local customizations

These local changes are still in place after the merge:

- `/qrspi` custom extension remains registered in `package.json`
- `cmux` workspace rename still uses `pi.setSessionName()` instead of `cmux workspace-action --action rename`
- single-dash session directory delimiters are preserved in repo code and in the local `node_modules` patch
- local planner/spec completion wording still instructs agents to summarize and call `subagent_done` automatically on normal completion

### 3. Merge conflict resolutions

Conflicts were resolved in:

- `package.json`
  - kept upstream version `3.0.0`
  - kept local custom extension entry: `./pi-extension/custom/index.ts`
  - accepted upstream removal of `./pi-extension/session-artifacts/index.ts`
- `pi-extension/subagents/plan-skill.md`
  - kept local `subagent_done` completion-flow wording
  - updated wording to refer to returning the spec file path automatically

### 4. Patch verification state

Repo patch markers verified after merge:

- `pi-extension/subagents/cmux.ts:179`
- `pi-extension/subagents/cmux.ts:432`
- `pi-extension/subagents/index.ts:27`
- `pi-extension/subagents/index.ts:235`
- `pi-extension/subagents/index.ts:939`
- `pi-extension/subagents/index.ts:1090`

Post-install patch marker still present:

- `node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.js:209`

### 5. Sanity checks

- `npm test` ✅ (39/39 passing)
- verified repo `PATCH(local)` markers ✅
- verified `node_modules` single-dash patch still present ✅

### 6. Push status

- pushed merge to `origin/main`
- merge commit: `ccdfd67`
