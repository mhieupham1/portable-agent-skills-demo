## Code Review: task service

**Files reviewed:** 2
**Status:** ⚠️ Needs Changes

### Findings

#### High
- `fixtures/review/src/task-service.js:6` — The function mutates the task title
  before authorization at line 8. A forbidden caller can alter a live
  object; a later save can persist that unauthorized change.

### Summary

Move authorization ahead of mutation before merge.

### Review coverage

- Inspected: `task-service.js` and `task-service.test.js`.
- Not verified: no test runner configuration was supplied.
