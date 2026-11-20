# Portable `code-review-v2` evaluation: Shared Todo List

**Recorded:** 2026-11-21 (Vietnam)  
**Skill package:** `code-review-v2` (167-line workflow plus two reference files)  
**Claude Code:** 2.1.329, `claude-sonnet-5-5`  
**Codex CLI:** 0.171.0, `gpt-5.6-terra`

## Protocol

The same `code-review-v2` package is installed byte-identically in
`agent-skills/`, `.claude/skills/` and `.agents/skills/`. Both platforms were
explicitly asked to review the same two Shared Todo List fixture files:

- [`fixtures/review/src/task-service.js`](../../fixtures/review/src/task-service.js)
- [`fixtures/review/src/task-service.test.js`](../../fixtures/review/src/task-service.test.js)

The fixture deliberately assigns `task.title` before checking that the current
user belongs to `task.workspaceId`. The rubric in
[`tests/code-review-v2-rubric.md`](../../tests/code-review-v2-rubric.md)
checks review envelope, severity, location, authorization-ordering defect,
impact and scope disclosure.

## Results

| Platform | Score | Evidence |
| --- | ---: | --- |
| Claude Code | 6/6 | [Transcript](claude-review.md), [score](claude-score.txt) |
| Codex | 6/6 | [Transcript](codex-review.md), [score](codex-score.txt) |

Both reviews locate the mutation at `task-service.js:6`, explain that a denied
caller can still alter the in-memory task object, and disclose what they could
not verify. This confirms a shared review output contract on this small,
explicitly-scoped case; it is not a general model benchmark.
