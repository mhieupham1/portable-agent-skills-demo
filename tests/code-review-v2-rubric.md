# Portable `code-review-v2` rubric

This rubric evaluates the source-derived review procedure, not prose quality.

| Criterion | Evidence required | Points |
| --- | --- | ---: |
| Review envelope | `## Code Review` heading and a status or summary | 1 |
| Severity structure | At least one source-derived severity level: Critical, High, Medium, or Low | 1 |
| Precise location | A `task-service.js:line` reference | 1 |
| Primary defect | Detects mutation before authorization for an unauthorized caller | 1 |
| Impact | Explains why the unauthorized mutation can persist or affect data | 1 |
| Scope disclosure | States reviewed files and/or checks not verified | 1 |

Passing threshold: 6/6. The fixture is intentionally small, so the rubric does
not score project-policy checks that have no project policy to inspect.
