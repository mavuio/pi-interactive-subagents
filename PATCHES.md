# Local Patches

Modifications to upstream files that must survive merges from `upstream/main`.

After each `git merge upstream/main` or `npm install`, verify patches are still applied:

```bash
grep -rn "PATCH(local)" pi-extension/subagents/
grep -rn "PATCH(local)" node_modules/@mariozechner/pi-coding-agent/dist/
```

---

## § cmux-session-name

**Purpose:** Use `pi.setSessionName()` for workspace renaming instead of `cmux workspace-action --action rename`, which causes an unwanted terminal rename side-effect.

**Upstream behaviour:** `renameWorkspace()` calls `execSync("cmux workspace-action --action rename ...")`
**Patched behaviour:** `renameWorkspace()` calls a `sessionNameSetter` callback that invokes `pi.setSessionName()`

### Files modified

#### `pi-extension/subagents/cmux.ts`

1. **Added** `sessionNameSetter` callback + `setSessionNameCallback()` export (after `cmuxSubagentPane` declaration)
2. **Changed** `renameWorkspace()` cmux branch: calls `sessionNameSetter?.(title)` instead of `execSync("cmux workspace-action ...")`

#### `pi-extension/subagents/index.ts`

1. **Added** `setSessionNameCallback` to imports from `./cmux.ts`
2. **Added** `setSessionNameCallback((name) => pi.setSessionName(name))` in `session_start` handler
3. **Added** `pi.setSessionName(params.name)` in the `subagent` tool handler (on launch)

### How to re-apply after a merge conflict

If upstream changes `renameWorkspace()` in `cmux.ts`:
- Replace the `cmux workspace-action` call with `sessionNameSetter?.(title)`
- Ensure the `sessionNameSetter` variable and `setSessionNameCallback` export exist

If upstream changes the `session_start` handler or `subagent` tool in `index.ts`:
- Re-add `setSessionNameCallback` import
- Re-add `setSessionNameCallback((name) => pi.setSessionName(name))` in `session_start`
- Re-add `pi.setSessionName(params.name)` in the subagent tool handler

---

## § session-dir-single-dash

**Purpose:** Session directories use single-dash delimiters instead of double-dash, producing cleaner paths like `-Users-manfred-Documents-www-tradeomat-` instead of `--Users-manfred-Documents-www-tradeomat--`.

**Upstream behaviour:** `getDefaultSessionDir()` wraps the encoded cwd with `--` prefix and suffix
**Patched behaviour:** Uses single `-` prefix and suffix

### Files modified

#### `node_modules/@mariozechner/pi-coding-agent/dist/core/session-manager.js`

1. **Changed** line ~209: `` `--${...}--` `` → `` `-${...}-` ``

### How to re-apply after `npm install`

```js
// In getDefaultSessionDir(), change:
const safePath = `--${cwd.replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}--`;
// To:
const safePath = `-${cwd.replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}-`; // PATCH(local): single dash delimiters
```

---

## Custom extension: `pi-extension/custom/`

**Not a patch** — fully separate code that doesn't touch upstream files.

- `index.ts` — registers `/qrspi` command
- `qrspi-skill.md` — QRSPI skill file
- Registered in `package.json` → `pi.extensions[]` (this is a minor merge point)
