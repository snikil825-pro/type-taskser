import { addTask, advance, filterByStatus } from "./model.js";
let tasks = [];
let currentFilter = "all";
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const statusSelect = document.getElementById("status");
const listEl = document.getElementById("list");
const chipsEl = document.getElementById("chips");
const messageEl = document.getElementById("message");
const countEl = document.getElementById("task-count");
const emptyEl = document.getElementById("empty");
function statusLabel(status) {
    const labels = {
        "todo": "To do",
        "in-progress": "In progress",
        "done": "Done"
    };
    return labels[status];
}
function render() {
    const visibleTasks = filterByStatus(tasks, currentFilter);
    listEl.replaceChildren();
    countEl.textContent = String(visibleTasks.length);
    emptyEl.hidden = visibleTasks.length > 0;
    visibleTasks.forEach((task) => {
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
            tasks = tasks.filter((candidate) => candidate.id !== task.id);
            render();
        });
        actions.append(advanceButton, deleteButton);
        item.append(mark, content, badge, actions);
        listEl.append(item);
    });
    chipsEl.querySelectorAll("button[data-filter]").forEach((button) => {
        const filterButton = button;
        filterButton.classList.toggle("active", filterButton.dataset.filter === currentFilter);
        filterButton.setAttribute("aria-pressed", String(filterButton.dataset.filter === currentFilter));
    });
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
        messageEl.textContent = "Please enter a task title first.";
        titleInput.focus();
        return;
    }
    const status = statusSelect.value;
    tasks = addTask(tasks, title, status);
    titleInput.value = "";
    messageEl.textContent = "";
    titleInput.focus();
    render();
});
chipsEl.addEventListener("click", (event) => {
    const target = event.target;
    const button = target.closest("button[data-filter]");
    if (!button)
        return;
    const selected = button.dataset.filter;
    if (selected === "all" || selected === "todo" || selected === "in-progress" || selected === "done") {
        currentFilter = selected;
        render();
    }
});
render();
