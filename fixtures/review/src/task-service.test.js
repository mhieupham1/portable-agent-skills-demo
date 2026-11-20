import { updateTask } from "./task-service.js";

test("updates a task title for a workspace member", () => {
  const currentUser = { id: "u-1", workspaceIds: ["ws-aurora"] };
  const task = { id: "task-1", workspaceId: "ws-aurora", title: "Old title" };

  expect(updateTask(currentUser, task, { title: "  Updated title  " }).title).toBe("Updated title");
});
