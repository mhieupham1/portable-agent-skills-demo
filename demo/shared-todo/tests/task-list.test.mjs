import assert from "node:assert/strict";
import test from "node:test";

async function loadTaskList() {
  try {
    return await import("../task-list.mjs");
  } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND") {
      return {};
    }

    throw error;
  }
}

test("creates an active task with a trimmed title", async () => {
  const { createTask } = await loadTaskList();

  assert.equal(typeof createTask, "function");

  const task = createTask(
    {
      id: "task-prepare-demo",
      title: "  Prepare agent-skills demo  ",
      assignee: "Mai Nguyen",
      dueDate: "2026-11-26",
    },
    new Date("2026-11-21T09:00:00.000Z"),
  );

  assert.deepEqual(task, {
    id: "task-prepare-demo",
    title: "Prepare agent-skills demo",
    assignee: "Mai Nguyen",
    dueDate: "2026-11-26",
    status: "active",
    createdAt: "2026-11-21T09:00:00.000Z",
    completedAt: null,
  });
});

test("completes a task without mutating the active task", async () => {
  const { completeTask } = await loadTaskList();

  assert.equal(typeof completeTask, "function");

  const activeTask = {
    id: "task-review",
    title: "Review the shared Skill",
    assignee: "Minh Tran",
    dueDate: null,
    status: "active",
    createdAt: "2026-11-21T09:00:00.000Z",
    completedAt: null,
  };

  const completedTask = completeTask(activeTask, new Date("2026-11-21T10:15:00.000Z"));

  assert.equal(activeTask.status, "active");
  assert.equal(activeTask.completedAt, null);
  assert.equal(completedTask.status, "done");
  assert.equal(completedTask.completedAt, "2026-11-21T10:15:00.000Z");
});

test("filters tasks by active and done status", async () => {
  const { filterTasks } = await loadTaskList();

  assert.equal(typeof filterTasks, "function");

  const tasks = [
    { id: "task-1", status: "active" },
    { id: "task-2", status: "done" },
    { id: "task-3", status: "active" },
  ];

  assert.deepEqual(
    filterTasks(tasks, "active").map((task) => task.id),
    ["task-1", "task-3"],
  );
  assert.deepEqual(
    filterTasks(tasks, "done").map((task) => task.id),
    ["task-2"],
  );
});
