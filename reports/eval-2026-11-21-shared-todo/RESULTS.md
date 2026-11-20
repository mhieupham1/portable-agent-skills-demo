# Cross-platform Agent Skill evaluation: Shared Todo List

**Recorded:** 2026-11-20T17:13:31Z (2026-11-21 in Vietnam)  
**Portable artifact:** `agent-skills/requirements-and-review/SKILL.md`  
**Claude CLI:** 2.1.329, `claude-sonnet-5-5`  
**Codex CLI:** 0.171.0, `gpt-5.6-terra`

## Protocol

The same standard-frontmatter Skill was installed unchanged in its canonical
directory, `.claude/skills/requirements-and-review/`, and
`.agents/skills/requirements-and-review/`. The runner verified that the three
copies are byte-identical before calling either CLI.

Both platforms received the same prompt for each task and ran read-only:

1. Requirement definition for the intentionally incomplete Shared Todo List
   request in [`fixtures/requirements-request.md`](../../fixtures/requirements-request.md).
2. Code review for [`fixtures/review/src/task-service.js`](../../fixtures/review/src/task-service.js)
   and its focused test. The fixture intentionally mutates a task title before
   rejecting a caller from another workspace.

The rubric in [`tests/rubric.md`](../../tests/rubric.md) scores observable
procedure compliance, not wording similarity.

## Results

| Platform | Requirement definition | Code review | Result |
| --- | ---: | ---: | --- |
| Codex | 4/4 | 4/4 | **8/8 — pass** |
| Claude Code | 4/4 | 4/4 | **8/8 — pass** |

### Evidence

- [Claude requirement brief](claude-requirements.md) separates outcome, scope,
  open questions, assumptions, acceptance criteria, risks and the next decision.
- [Codex requirement brief](codex-requirements.md) supplies the same required
  structure while raising task permissions, due-date policy, retention,
  notifications and concurrent edits.
- [Claude review](claude-review.md) identifies the mutation before workspace
  authorization at `task-service.js:6` and reports priority and coverage.
- [Codex review](codex-review.md) identifies the same failure scenario at
  `task-service.js:6`, with `P1` priority and a testing gap.
- [Runner summary](summary.md) contains the versions and individual rubric
  scores.

## Limits and rerun

This is one deterministic smoke-evaluation run per task and platform, not a
benchmark of model quality, speed, cost or automatic Skill selection. It shows
that the same artifact and output procedure executed successfully in these two
installed CLI versions.

To repeat it with the current fixture:

```bash
bash tests/run-cross-platform-eval.sh reports/eval-rerun
```
