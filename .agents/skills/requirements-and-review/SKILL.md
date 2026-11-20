---
name: requirements-and-review
description: Define implementation-ready requirements or review a proposed code change using evidence from the workspace. Use when a user asks to clarify a feature, turn a request into acceptance criteria, inspect a diff, or perform code review. Do not use to implement the feature or fix review findings unless separately asked.
---

# Requirements and Review

Choose the mode that matches the request. If it asks for both, define requirements before reviewing code.

## Shared rules

- Inspect the supplied files and relevant local context before drawing a conclusion.
- Clearly separate verified facts, assumptions, and open questions.
- Do not write or modify production code in either mode unless the user separately asks for implementation.
- Keep the result actionable and concise; do not invent product decisions or defects.

## Requirement-definition mode

Turn an ambiguous request into a brief that an engineer and stakeholder can use to decide whether implementation may begin.

1. State the user outcome and the included and excluded scope.
2. List only the open questions whose answers materially change behavior, security, data handling, cost, or delivery.
3. If work must proceed without an answer, state the assumption and its risk explicitly.
4. Write observable acceptance criteria. Include failure paths and permissions/data constraints when they apply.
5. Identify dependencies, non-functional constraints, and the next decision or owner when evidence supports them.

Use these headings:

```markdown
## Outcome
## Scope
## Open questions
## Assumptions
## Acceptance criteria
## Risks and dependencies
## Next decision
```

## Code-review mode

Review the requested diff, files, or repository state. Findings must be specific enough for an author to verify without trusting the reviewer.

1. Read the changed code and the nearest tests, callers, and conventions needed to judge it.
2. Report only defects introduced by the change or directly exposed by the requested review scope.
3. For every finding, give a priority (`P0`–`P3`), a precise file and line reference, the failure scenario, and why it matters.
4. Prefer a small number of high-confidence findings. Do not report style preferences as bugs.
5. If no actionable defect is found, say `No findings` and name the checks performed plus any meaningful testing gap.

Use this finding format:

```markdown
### P1 — short title
`path/to/file.ext:line`

Failure scenario and impact. Explain the evidence from the code.
```

Finish with:

```markdown
## Review coverage
- Inspected: ...
- Not verified: ...
```
