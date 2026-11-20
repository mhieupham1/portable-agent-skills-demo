## Code Review: task-service updateTask

**Files reviewed:** 2
**Status:** ❌ Blocked

### Findings

#### 🔴 Critical
- `src/task-service.js:6-10`: The authorization check runs after the mutation. `task.title` is assigned before the workspace membership test. A user outside the workspace gets a "forbidden" error, but the shared `task` object has already been changed. If `task` is a cached or in-memory reference, the unauthorized edit persists and is visible to others.
  ```js
  // Current
  task.title = input.title.trim();
  if (!currentUser.workspaceIds.includes(task.workspaceId)) throw new Error("forbidden");

  // Suggested: authorize first, then validate, then mutate
  if (!currentUser.workspaceIds.includes(task.workspaceId)) {
    throw new Error("forbidden");
  }
  const title = input.title?.trim();
  if (!title) throw new Error("invalid title");
  task.title = title;
  ```

#### 🟠 High
- `src/task-service.js:2`: Input validation is shaky. `input` being null or undefined throws a raw `TypeError`. A non-string `title`, such as a number, throws a `TypeError` on `.trim()` instead of "invalid title". Checking `typeof input?.title === "string"` fixes both.
- `src/task-service.js:2-10`: Validation runs before authorization. A non-member can tell valid input from invalid input, and gets "invalid title" rather than "forbidden". Checking authorization first avoids this. It is minor on its own, but it follows from the ordering problem above.
- `src/task-service.test.js`: There are no negative tests, and this is how the critical bug got through. Missing cases:
  - a non-member is rejected with "forbidden" **and** `task.title` is unchanged
  - an empty or whitespace-only title is rejected
  - a missing or non-string title is rejected

#### 🟡 Medium
- `src/task-service.js:6`: The function mutates its argument and returns the same object. Returning a new object, `{ ...task, title }`, would avoid this class of bug entirely. Only do this if callers don't rely on in-place mutation.
- `src/task-service.js:3,9`: Plain `Error` with message strings makes it hard for callers to tell a 400 from a 403. Typed errors, or an error `code` field, would help.
- `src/task-service.js:8`: `currentUser.workspaceIds` is assumed to be defined. A user object without it throws a `TypeError` instead of "forbidden".

#### 🟢 Low
- `src/task-service.test.js:7`: The assertion only checks `.title`. It's fine for a happy-path test, but it could also confirm that other fields are untouched.

### Summary
The happy path works, but the function changes data before it checks permission. That is a real authorization flaw: a rejected request still alters the task. The fix is to reorder the checks (authorize, validate, then mutate) and add negative tests, including one that asserts the task is unchanged after a "forbidden" error.

### Review coverage
- Inspected: both files in full. No `AGENTS.md`, `CLAUDE.md` or `docs/code-standards.md` exists in the project, so I applied only the skill checklist.
- Not verified: I did not run the tests. I did not check callers, so I don't know whether `task` is a shared or cached object. The severity of the critical finding depends on that. No plan or spec was available.
