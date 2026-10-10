export function addTask(tasks, title, status = "todo") {
    const newTask = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title: title.trim(),
        status,
        createdAt: new Date().toLocaleDateString()
    };
    return [...tasks, newTask];
}
export function advance(tasks, id) {
    const nextStatus = {
        "todo": "in-progress",
        "in-progress": "done",
        "done": "todo"
    };
    return tasks.map(task => task.id === id ? { ...task, status: nextStatus[task.status] } : task);
}
export function completeTask(tasks, id) {
    return tasks.map(task => task.id === id ? { ...task, status: "done" } : task);
}
export function filterByStatus(tasks, status) {
    return status === "all" ? tasks : tasks.filter(task => task.status === status);
}
