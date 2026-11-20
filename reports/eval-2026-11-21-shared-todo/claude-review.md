## Findings

### P1 — Authorization check runs after the mutation
`fixtures/review/src/task-service.js:6-10`

`task.title` is assigned on line 6. The workspace membership check doesn't run until line 8. When a user who isn't in `task.workspaceId` calls `updateTask`, the function throws `"forbidden"`, but the title has already been changed.

The `task` object is mutated in place. If the caller got it from a cache, an identity map or an ORM entity that is saved later, the unauthorized title change stays in memory. It can then be persisted or returned to other requests. That makes it an authorization bypass, even though the function reports failure.

Move the membership check before any mutation, and ideally before input validation. That way a non-member can't probe validation behaviour either.

### P2 — Missing-input and malformed-input paths are not handled
`fixtures/review/src/task-service.js:2`

- `input` being `undefined` or `null` throws a `TypeError`, not the intended `"invalid title"` error.
- A non-string `title`, such as `123` or `{}`, passes `!input.title` and then fails on `.trim()` with a `TypeError`.
- `currentUser.workspaceIds` being missing also throws a `TypeError` on line 8.

Callers that map error messages to status codes would turn these into 500s instead of 400 or 403. I couldn't verify this because no caller exists in the fixture. The P1 fix should also check that `title` is a string.

### P2 — The tests cover only the happy path
`fixtures/review/src/task-service.test.js:3-8`

There is a single test, for a member updating a title. No test covers the following:

- A non-member is rejected with `"forbidden"`.
- The task is left unchanged after a rejection. This is the test that would have caught the P1 bug.
- An empty or whitespace-only title is rejected.
- A non-string title or a missing `input` is rejected.

The suite passes against the current code even though the authorization ordering is wrong.

### P3 — The function mutates its argument
`fixtures/review/src/task-service.js:6`

`updateTask` mutates the passed-in `task` and returns the same reference. This is acceptable if it's the intended contract, but it is what makes the P1 bug harmful. Consider returning a new object, such as `{ ...task, title }`, after the checks pass.

## Review coverage
- Inspected: `fixtures/review/src/task-service.js` and `fixtures/review/src/task-service.test.js`, in full.
- Not verified: I didn't run the tests. No callers, persistence layer or error-handling conventions exist in the fixture, so the P1 persistence impact and the P2 error-mapping impact are inferred from the code, not confirmed. The test framework setup is also unchecked, since `test` and `expect` are used as globals.
