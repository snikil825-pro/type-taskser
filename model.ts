export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
}

export function addTask(tasks: Task[], title: string, status: TaskStatus = "todo"): Task[] {
  const newTask: Task = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: title.trim(),
    status,
    createdAt: new Date().toLocaleDateString()
  };
  return [...tasks, newTask];
}

export function advance(tasks: Task[], id: number): Task[] {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    "todo": "in-progress",
    "in-progress": "done",
    "done": "todo"
  };
  return tasks.map(task =>
    task.id === id ? { ...task, status: nextStatus[task.status] } : task
  );
}

export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map(task => task.id === id ? { ...task, status: "done" } : task);
}

export function filterByStatus(tasks: Task[], status: "all" | TaskStatus): Task[] {
  return status === "all" ? tasks : tasks.filter(task => task.status === status);
}
