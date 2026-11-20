import { completeTask, countActiveTasks, createTask, filterTasks } from "./task-list.mjs";

const taskForm = document.querySelector("#new-task-form");
const titleInput = document.querySelector("#task-title");
const assigneeInput = document.querySelector("#task-assignee");
const dueDateInput = document.querySelector("#task-due-date");
const formMessage = document.querySelector("#form-message");
const taskCount = document.querySelector("#task-count");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

let activeFilter = "all";
let nextTaskNumber = 4;
let tasks = [
  createTask(
    {
      id: "task-1",
      title: "Clarify the shared Skill acceptance criteria",
      assignee: "Mai Nguyen",
      dueDate: "2026-11-24",
    },
    new Date("2026-11-21T08:30:00.000Z"),
  ),
  createTask(
    {
      id: "task-2",
      title: "Capture Claude Code and Codex screenshots",
      assignee: "Minh Tran",
      dueDate: "2026-11-25",
    },
    new Date("2026-11-21T08:45:00.000Z"),
  ),
  {
    ...createTask(
      {
        id: "task-3",
        title: "Set up the portable Skill folders",
        assignee: "Mai Nguyen",
        dueDate: "2026-11-21",
      },
      new Date("2026-11-20T15:00:00.000Z"),
    ),
    status: "done",
    completedAt: "2026-11-20T16:10:00.000Z",
  },
];

function formatDueDate(dueDate) {
  if (!dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${dueDate}T12:00:00`));
}

function taskMeta(task) {
  return `${task.assignee} · ${formatDueDate(task.dueDate)}`;
}

function buildTaskItem(task) {
  const item = document.createElement("li");
  const content = document.createElement("div");
  const title = document.createElement("p");
  const meta = document.createElement("p");
  const action = document.createElement("button");

  item.className = "task-item";
  item.dataset.status = task.status;
  content.className = "task-content";
  title.className = "task-title";
  title.textContent = task.title;
  meta.className = "task-meta";
  meta.textContent = taskMeta(task);
  content.append(title, meta);

  action.className = "status-action";
  action.type = "button";
  action.dataset.taskId = task.id;

  if (task.status === "done") {
    action.textContent = "Completed";
    action.disabled = true;
  } else {
    action.textContent = "Mark done";
    action.setAttribute("aria-label", `Mark ${task.title} as done`);
  }

  item.append(content, action);
  return item;
}

function render() {
  const visibleTasks = filterTasks(tasks, activeFilter);
  const activeTasks = countActiveTasks(tasks);

  taskCount.textContent = `${activeTasks} active task${activeTasks === 1 ? "" : "s"}`;
  taskList.replaceChildren(...visibleTasks.map(buildTaskItem));
  emptyState.hidden = visibleTasks.length > 0;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const newTask = createTask({
      id: `task-${nextTaskNumber}`,
      title: titleInput.value,
      assignee: assigneeInput.value,
      dueDate: dueDateInput.value,
    });

    nextTaskNumber += 1;
    tasks = [newTask, ...tasks];
    activeFilter = "all";
    taskForm.reset();
    formMessage.textContent = `Added “${newTask.title}”.`;
    render();
    titleInput.focus();
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    render();
  });
});

taskList.addEventListener("click", (event) => {
  const action = event.target.closest("[data-task-id]");

  if (!action) {
    return;
  }

  tasks = tasks.map((task) =>
    task.id === action.dataset.taskId ? completeTask(task) : task,
  );
  formMessage.textContent = "Task marked as completed.";
  render();
});

render();
