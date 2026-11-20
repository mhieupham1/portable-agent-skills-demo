## Outcome
Workspace members can maintain one shared todo list. A member can add a task, assign it to another member, and mark it complete. Every member of the workspace sees the same list.

## Scope
**Verified from the request** (`fixtures/requirements-request.md`):
- **Included:** add a task, assign it to a member, mark it complete, and show one shared list per workspace.
- **Excluded:** nothing is excluded explicitly. The request names five undecided areas: edit/delete permissions, due dates, completed-task retention, notifications, and concurrent edits.

**Proposed for a first release:** keep the five undecided areas out of scope unless the owner answers the questions below. This is my proposal, not something the request states.

No codebase was inspected, because the working directory contains only the fixture. Nothing is verified about existing workspace, user, or permission models.

## Open questions
These answers change behavior, security, or data handling.

1. **Permissions.** Who may edit, reassign, complete, or delete a task? Options are the creator, the assignee, any member, or admins only. This sets the authorization model and is hard to change after launch.
2. **Completion and retention.**
   - Can a completed task be reopened?
   - Are completed tasks hidden, archived, or kept in the list indefinitely?
   - Is deletion hard or soft?
3. **Concurrent edits.** Is last-write-wins acceptable, or must conflicts be detected, for example with a version check that rejects the stale edit? This affects the data model and API.
4. **Assignment rules.** Can a task be unassigned? Can it have multiple assignees? What happens to a member's tasks when they leave the workspace?
5. **Notifications.** Is any notification required for v1, such as on assignment? If so, through which channel?
6. **Due dates.** Are they in v1 at all? If so, are they date-only or date and time, and does recurrence apply? The request says this is undecided.
7. **Live updates.** "Everyone sees the same list" could mean consistent on reload or updated in real time. Which is intended?

## Assumptions
Work can start on these if no answers arrive. Each one has a risk.

| Assumption | Risk if wrong |
|---|---|
| Any workspace member can add, assign, and complete tasks. Only the creator or a workspace admin can delete. | A permissive default may expose tasks to unwanted edits. Tightening it later can break existing behavior. |
| Completion can be undone (reopen), and completed tasks stay visible. | If retention rules turn out to differ, a data migration may be needed. |
| Assignment is a single optional member. | Moving to multiple assignees later changes the schema. |
| Concurrent edits use last-write-wins. | Silent loss of updates. |
| Refresh or polling is enough, with no real-time push. | Users may see stale lists. |
| No due dates, recurrence, or notifications in v1. | Stakeholders may expect them. |

## Acceptance criteria
1. A signed-in member can create a task with a non-empty title. An empty or whitespace-only title is rejected with a visible error and nothing is saved.
2. A member can assign a task to any current member of the same workspace. Assigning to a non-member, or to a member of another workspace, is rejected.
3. A member can mark a task complete. The task shows a completed state and its completion time to every member after reload.
4. Two members of one workspace see the same tasks, assignees, and completion states. A member of a different workspace cannot see, read, or modify these tasks, including by calling the API directly.
5. A user who is not signed in, or who is not a workspace member, gets an authorization error on every operation, and no data changes.
6. A user who lacks permission to edit or delete a task (per the answer to question 1) is blocked server-side. The UI also hides or disables the action.
7. If two members edit the same task at once, the outcome follows the chosen concurrency rule (question 3). No silent corruption occurs, and the final state is identical for all viewers.
8. If a save fails, the user sees an error and the UI does not show the change as persisted.
9. The list loads in under an agreed time for an agreed maximum list size. Both numbers need a stakeholder decision.

## Risks and dependencies
- **Authorization:** each operation must check workspace membership on the server. Hiding controls in the UI is not enough.
- **Dependencies:** an existing workspace and membership model, authentication, and a persistence layer. None of these were verified.
- **Concurrency:** a late decision on conflict handling may force rework of the API and data model.
- **Scope creep:** due dates with time zones, recurrence, and notifications each add substantial work if pulled in.
- **Data lifecycle:** retention, deletion, and member-removal rules have privacy implications.

## Next decision
The product owner should answer questions 1 to 3 first. Permissions, completion and retention, and concurrency are the ones that shape the data model and security. Questions 4 to 7 can follow, or be deferred explicitly with the assumptions above. Implementation should not begin until questions 1 to 3 are answered or the owner explicitly accepts the stated assumptions.
