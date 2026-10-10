import { Task, TaskStatus, addTask, advance, filterByStatus } from "./model.js";

let tasks: Task[] = [];
let currentFilter: "all" | TaskStatus = "all";

const form = document.getElementById("task-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const statusSelect = document.getElementById("status") as HTMLSelectElement;
const listEl = document.getElementById("list") as HTMLUListElement;
const chipsEl = document.getElementById("chips") as HTMLElement;
const messageEl = document.getElementById("message") as HTMLParagraphElement;
const countEl = document.getElementById("task-count") as HTMLSpanElement;
const emptyEl = document.getElementById("empty") as HTMLDivElement;

function statusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    "todo": "To do",
    "in-progress": "In progress",
    "done": "Done"
  };
  return labels[status];
}

function render(): void {
  const visibleTasks = filterByStatus(tasks, currentFilter);
  listEl.replaceChildren();
  countEl.textContent = String(visibleTasks.length);
  emptyEl.hidden = visibleTasks.length > 0;

  visibleTasks.forEach((task: Task) => {
    const item = document.createElement("li");
    item.className = "task";

    const mark = document.createElement("div");
    mark.className = "task-mark";
    mark.textContent = task.status === "done" ? "✓" : "✦";
    mark.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("div");
    title.className = task.status === "done" ? "task-title is-done" : "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.textContent = `Added ${task.createdAt}`;

    const badge = document.createElement("span");
    badge.className = `status-badge ${task.status}`;
    badge.textContent = statusLabel(task.status);

    content.append(title, meta);
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const advanceButton = document.createElement("button");
    advanceButton.className = "small-button";
    advanceButton.type = "button";
    advanceButton.textContent = task.status === "done" ? "Reopen" : "Advance →";
    advanceButton.setAttribute("aria-label", `${task.status === "done" ? "Reopen" : "Advance"} task: ${task.title}`);
    advanceButton.addEventListener("click", () => {
      tasks = advance(tasks, task.id);
      render();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "small-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.title}`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((candidate: Task) => candidate.id !== task.id);
      render();
    });

    actions.append(advanceButton, deleteButton);
    item.append(mark, content, badge, actions);
    listEl.append(item);
  });

  chipsEl.querySelectorAll("button[data-filter]").forEach((button: Element) => {
    const filterButton = button as HTMLButtonElement;
    filterButton.classList.toggle("active", filterButton.dataset.filter === currentFilter);
    filterButton.setAttribute("aria-pressed", String(filterButton.dataset.filter === currentFilter));
  });
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    messageEl.textContent = "Please enter a task title first.";
    titleInput.focus();
    return;
  }

  const status = statusSelect.value as TaskStatus;
  tasks = addTask(tasks, title, status);
  titleInput.value = "";
  messageEl.textContent = "";
  titleInput.focus();
  render();
});

chipsEl.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const button = target.closest("button[data-filter]") as HTMLButtonElement | null;
  if (!button) return;

  const selected = button.dataset.filter;
  if (selected === "all" || selected === "todo" || selected === "in-progress" || selected === "done") {
    currentFilter = selected;
    render();
  }
});

render();
