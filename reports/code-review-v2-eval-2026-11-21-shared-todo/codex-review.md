## Code Review: fixtures/review task service

**Files reviewed:** 2  
**Status:** ❌ Blocked

### Findings

#### 🔴 Critical

- `fixtures/review/src/task-service.js:6` — The task is mutated before workspace authorization at line 8. An unauthorized request throws `"forbidden"` but still changes `task.title`, enabling a cross-workspace write if the object is persisted or reused.

  ```js
  // Suggested
  if (!currentUser.workspaceIds.includes(task.workspaceId)) {
    throw new Error("forbidden");
  }

  task.title = input.title.trim();
  ```

#### 🟠 High

- `fixtures/review/src/task-service.test.js:3` — There is no regression test for unauthorized updates preserving the original title. Add a test that expects `"forbidden"` and asserts the task remains unchanged.

#### 🟡 Medium

- None.

#### 🟢 Low

- None.

### Summary

The happy path is concise and trims titles correctly, but authorization must occur before any mutation. This is a merge blocker.

### Review coverage

- Inspected: both supplied files; no project rules, package manifest, or test-runner configuration were present in the fixture.
- Verified: both files pass JavaScript module syntax checks; reproduced that an unauthorized request mutates the task before throwing.
- Not verified: execution through the project’s actual test runner, since none was available.