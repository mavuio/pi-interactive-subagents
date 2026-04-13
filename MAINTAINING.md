# Maintaining This Fork

This is a fork of [HazAT/pi-interactive-subagents](https://github.com/HazAT/pi-interactive-subagents) with local customizations.

## Repo Structure

```
pi-extension/
  subagents/          ← upstream code (with minimal marked patches)
  session-artifacts/  ← upstream code (unmodified)
  custom/             ← local code (never touched by upstream)
    index.ts          ← /qrspi command
    qrspi-skill.md    ← QRSPI skill file
```

## Local Customizations

| What | Where | Type |
|---|---|---|
| `/qrspi` command + skill | `pi-extension/custom/` | Separate extension — no merge conflicts |
| `pi.setSessionName()` for workspace rename | `pi-extension/subagents/cmux.ts`, `index.ts` | Patches to upstream — see [PATCHES.md](./PATCHES.md) |
| Single-dash session directory delimiters | `pi-extension/subagents/index.ts`, `node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.js` | Patch in repo + post-install patch — see [PATCHES.md](./PATCHES.md) |
| Custom extension registration | `package.json` → `pi.extensions[]` | One extra line |

All patches in upstream files are marked with `// PATCH(local):` comments.

## Merging Upstream Changes

```bash
# 1. Fetch latest upstream
git fetch upstream

# 2. Merge
git merge upstream/main

# 3. Resolve any conflicts, then verify all repo patch markers survived
grep -rn "PATCH(local)" pi-extension/subagents/
grep -rn "PATCH(local)" node_modules/@mariozechner/pi-coding-agent/dist/

# Expected output (6 repo matches + 1 node_modules match):
#   cmux.ts:179   — PATCH(local): sessionNameSetter declaration
#   cmux.ts:432   — PATCH(local): sessionNameSetter?.(title) call
#   index.ts:27   — PATCH(local): setSessionNameCallback import
#   index.ts:131  — PATCH(local): single-dash child session dirs
#   index.ts:726  — PATCH(local): setSessionNameCallback wiring in session_start
#   index.ts:876  — PATCH(local): pi.setSessionName on subagent launch
#   core/session-manager.js:209 — PATCH(local): single-dash default session dir

# 4. Run tests
npm test

# 5. If patches were lost during merge, see PATCHES.md for re-application instructions
```

## If a Patch Is Lost After Merge

1. Open [PATCHES.md](./PATCHES.md)
2. Find the relevant section (e.g. `§ cmux-session-name`)
3. Follow the "How to re-apply" instructions
4. Re-add the `// PATCH(local):` comment markers
5. Commit: `git commit -m "fix: re-apply local patches after upstream merge"`
