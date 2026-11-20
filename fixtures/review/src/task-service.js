export function updateTask(currentUser, task, input) {
  if (!input.title || !input.title.trim()) {
    throw new Error("invalid title");
  }

  task.title = input.title.trim();

  if (!currentUser.workspaceIds.includes(task.workspaceId)) {
    throw new Error("forbidden");
  }

  return task;
}
