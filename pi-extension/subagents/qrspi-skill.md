---
name: qrspi
description: >
  QRSPI workflow: Questions → Research → Structure → Plan → Implement.
  Full orchestrated development flow with architecture definition before planning.
  Requires the subagents extension and a supported multiplexer.
---

# QRSPI

A development workflow that separates concerns into five phases:
- **Q**uestions — clarify WHAT to build (spec agent)
- **R**esearch — understand the codebase (scout agent)
- **S**tructure — define architecture & file layout (structure agent)
- **P**lan — figure out HOW and create todos (planner agent)
- **I**mplement — execute todos and review (workers + reviewer)

**Announce at start:** "Let me investigate first, then we'll go through the QRSPI flow — Questions, Research, Structure, Plan, Implement."

---

## Tab Titles

Use `set_tab_title` to keep the user informed of progress. Update at every phase transition.

| Phase      | Title example                                                   |
| ---------- | --------------------------------------------------------------- |
| Research   | `🔍 Q1-Research: <short task>`                                  |
| Questions  | `📝 Q2-Spec: <short task>`                                     |
| Structure  | `🏗️ Q3-Structure: <short task>`                                 |
| Planning   | `💬 Q4-Plan: <short task>`                                      |
| Executing  | `🔨 Q5-Implement: 1/3 — <short task>` (update counter per worker) |
| Reviewing  | `🔎 Q5-Review: <short task>`                                    |
| Done       | `✅ Done: <short task>`                                         |

Name subagents with context:

- Scout: `"🔍 Scout"`
- Spec: `"📝 Spec"`
- Structure: `"🏗️ Structure"`
- Planner: `"💬 Planner"`
- Workers: `"🔨 Worker 1/3"`, `"🔨 Worker 2/3"`, etc.
- Reviewer: `"🔎 Reviewer"`

---

## The Flow

```
Phase 1: Research (main session + optional scout)
    ↓
Phase 2: Questions — Spawn Spec Agent (interactive — clarifies WHAT to build)
    ↓
Phase 3: Structure — Spawn Structure Agent (interactive — defines architecture & file layout)
    ↓
Phase 4: Plan — Spawn Planner Agent (interactive — creates todos with structure as input)
    ↓
Phase 5: Implement — Execute Todos (workers) + Review
    ↓
Phase 6: Archive — Copy spec/structure/plan into .pi/history/ and commit
```

---

## Phase 1: Research

Before spawning any interactive agents, orient yourself:

```bash
ls -la
find . -type f -name "*.ts" | head -20  # or relevant extension
cat package.json 2>/dev/null | head -30
```

Spend 30–60 seconds. The goal is to give the spec agent useful context.

**If deeper context is needed** (large codebase, unfamiliar architecture), spawn an autonomous scout subagent first:

```typescript
subagent({
  name: "🔍 Scout",
  agent: "scout",
  task: "Analyze the codebase. Map file structure, key modules, patterns, and conventions. Summarize findings concisely.",
});
```

Read the scout's summary from the subagent result before proceeding.

---

## Phase 2: Questions (Spec Agent)

Spawn the interactive spec agent. The `spec` agent clarifies intent, requirements, effort level, and success criteria (ISC) with the user.

```typescript
subagent({
  name: "📝 Spec",
  agent: "spec",
  task: `Define spec: [what the user wants to build]

Context from investigation:
[paste relevant findings from Phase 1 here]`,
});
```

**The user works with the spec agent.** When done, the spec artifact path is returned.

---

## Phase 3: Structure (Structure Agent)

Read the spec artifact, then spawn the structure agent. The structure agent takes the spec and codebase context as input, and defines the architecture — component boundaries, data flow, tech choices, and concrete file layout.

```typescript
// Read the spec first
read_artifact({ name: "specs/YYYY-MM-DD-<name>.md" });

subagent({
  name: "🏗️ Structure",
  agent: "qrspi-structure",
  task: `Define architecture and file structure for spec: specs/YYYY-MM-DD-<name>.md

Context from investigation:
[paste relevant findings]`,
});
```

**The user works with the structure agent.** The structure agent will NOT re-clarify requirements — that's done. It focuses on architecture decisions, component boundaries, and file layout.

When done, the structure document is returned.

---

## Phase 4: Plan (Planner Agent)

Read both the spec and structure artifacts, then spawn the planner. The planner uses the structure document to create well-scoped todos — it doesn't need to re-derive the architecture.

```typescript
// Read the spec and structure first
read_artifact({ name: "specs/YYYY-MM-DD-<name>.md" });
read_artifact({ name: "structures/YYYY-MM-DD-<name>.md" });

subagent({
  name: "💬 Planner",
  agent: "planner",
  task: `Plan implementation for:
- Spec: specs/YYYY-MM-DD-<name>.md
- Structure: structures/YYYY-MM-DD-<name>.md

The structure document defines the architecture, component boundaries, and file layout.
Use it as the basis for your todos — don't re-derive the architecture.

Context from investigation:
[paste relevant findings]`,
});
```

**The user works with the planner.** The planner focuses on breaking the structure into executable todos with code examples and references. The architecture decisions are already made — the planner creates the execution plan.

When done, the plan + todos are returned.

---

## Phase 5: Implement

### 5a. Review Plan & Todos

Once the planner closes, read the plan and todos:

```typescript
todo({ action: "list" });
```

Review with the user:

> "Here's what the planner produced: [brief summary]. Ready to execute, or anything to adjust?"

### 5b. Execute Todos

Spawn a scout first for implementation context, then workers sequentially:

```typescript
// 1. Scout gathers context
subagent({
  name: "🔍 Scout",
  agent: "scout",
  task: "Gather context for implementing [feature]. Read the plan at [plan path] and structure at [structure path]. Identify all files that will be created/modified, map existing patterns and conventions.",
});

// 2. Workers execute todos sequentially — one at a time
subagent({
  name: "🔨 Worker 1/N",
  agent: "worker",
  task: "Implement TODO-xxxx. Mark the todo as done. Plan: [plan path]\nStructure: [structure path]\n\nScout context: [paste scout summary]",
});

// Check result, then next todo
subagent({
  name: "🔨 Worker 2/N",
  agent: "worker",
  task: "Implement TODO-yyyy. Mark the todo as done. Plan: [plan path]\nStructure: [structure path]\n\nScout context: [paste scout summary]",
});
```

**Always run workers sequentially in the same git repo** — parallel workers will conflict on commits.

### 5c. Review

After all todos are complete:

```typescript
subagent({
  name: "🔎 Reviewer",
  agent: "reviewer",
  task: "Review the recent changes. Plan: [plan path]\nStructure: [structure path]",
});
```

Triage findings:

- **P0** — Real bugs, security issues → fix now
- **P1** — Genuine traps, maintenance dangers → fix before merging
- **P2** — Minor issues → fix if quick, note otherwise
- **P3** — Nits → skip

Create todos for P0/P1, run workers to fix, re-review only if fixes were substantial.

---

## Phase 6: Archive to History

After all work is done and reviewed, copy the session artifacts into the repo for a permanent, git-tracked record.

Write the spec, structure, and plan into `.pi/history/YYYY-MM-DD-<name>/`:

```bash
mkdir -p .pi/history/YYYY-MM-DD-<name>
```

Then use the `write` tool to create each file:

- `.pi/history/YYYY-MM-DD-<name>/spec.md` — copy of the spec artifact
- `.pi/history/YYYY-MM-DD-<name>/structure.md` — copy of the structure artifact
- `.pi/history/YYYY-MM-DD-<name>/plan.md` — copy of the plan artifact

Read each artifact with `read_artifact` and write it into the history directory. Then commit:

```bash
git add .pi/history/YYYY-MM-DD-<name>/
git commit -m "docs: archive QRSPI session for <name>"
```

---

## ⚠️ Completion Checklist

Before reporting done:

1. ✅ All worker todos closed?
2. ✅ Every todo has a polished commit?
3. ✅ Reviewer has run?
4. ✅ Reviewer findings triaged and addressed?
5. ✅ Structure document matches what was actually built?
6. ✅ Session artifacts archived to `.pi/history/`?
