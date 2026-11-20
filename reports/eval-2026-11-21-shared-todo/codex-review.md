### P1 — Unauthorized request mutates the task before rejection
`fixtures/review/src/task-service.js:6`

A non-member supplying a valid title changes `task.title` before the workspace check at line 8 throws `"forbidden"`. Because `task` is mutated by reference, the unauthorized change remains observable and could later be persisted. Authorize before assigning the title.

The test covers only an authorized update; it lacks a regression case asserting a forbidden request leaves the task unchanged.

## Review coverage

- Inspected: `fixtures/review/src/task-service.js`, `fixtures/review/src/task-service.test.js`
- Not verified: Automated test execution; this workspace has no package manifest or test-runner configuration.