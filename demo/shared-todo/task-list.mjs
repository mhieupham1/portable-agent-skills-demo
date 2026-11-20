const FILTERS = new Set(["all", "active", "done"]);

function toIsoTimestamp(value) {
  const timestamp = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(timestamp.valueOf())) {
    throw new TypeError("Task timestamps must be valid dates.");
  }

  return timestamp.toISOString();
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`A task needs a ${field}.`);
  }

  return value.trim();
}

export function createTask(input, now = new Date()) {
  if (!input || typeof input !== "object") {
    throw new TypeError("A task needs task details.");
  }

  const dueDate = input.dueDate?.trim() || null;

  return {
    id: requiredText(input.id, "id"),
    title: requiredText(input.title, "title"),
    assignee: requiredText(input.assignee, "assignee"),
    dueDate,
    status: "active",
    createdAt: toIsoTimestamp(now),
    completedAt: null,
  };
}

export function completeTask(task, now = new Date()) {
  if (!task || task.status !== "active") {
    throw new TypeError("Only an active task can be completed.");
  }

  return {
    ...task,
    status: "done",
    completedAt: toIsoTimestamp(now),
  };
}

export function filterTasks(tasks, filter = "all") {
  if (!Array.isArray(tasks)) {
    throw new TypeError("Tasks must be an array.");
  }

  if (!FILTERS.has(filter)) {
    throw new TypeError("Task filter must be all, active, or done.");
  }

  return filter === "all" ? [...tasks] : tasks.filter((task) => task.status === filter);
}

export function countActiveTasks(tasks) {
  return filterTasks(tasks, "active").length;
}
