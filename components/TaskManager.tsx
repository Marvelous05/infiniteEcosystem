"use client";

import { useEffect, useState } from "react";

type TaskStatus = "pending" | "done";

type Task = {
  id: string;
  title: string;
  attendance: boolean;
  status: TaskStatus;
  createdAt: string;
};

const STORAGE_KEY = "infinite-biomed-tasks";

function generateId() {
  return crypto.randomUUID();
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved) as Task[];
  } catch {
    return [];
  }
}

export default function TaskManager() {
  const [title, setTitle] = useState("");
  const [attendance, setAttendance] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      attendance,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [newTask, ...current]);
    setTitle("");
    setAttendance(true);
  };

  const toggleStatus = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "pending" ? "done" : "pending" }
          : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-grey-light p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted">Task tracking</p>
            <h1 className="text-3xl font-semibold text-foreground">Attendance task board</h1>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {(["all", "pending", "done"] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-full px-4 py-2 font-semibold transition ${
                  filter === option
                    ? "bg-primary text-white"
                    : "bg-white text-foreground border border-grey-dark"
                }`}
              >
                {option === "all" ? "All tasks" : option === "pending" ? "Pending" : "Done"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreate} className="mt-6 grid gap-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <label className="form-label">
              Task title
              <input
                className="form-input w-full rounded-2xl px-4 py-3 text-sm"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task requiring attendance"
              />
            </label>
            <label className="form-label flex items-center justify-between rounded-2xl border border-grey-dark bg-white px-4 py-3 text-sm">
              <span>Requires attendance</span>
              <input
                type="checkbox"
                checked={attendance}
                onChange={(event) => setAttendance(event.target.checked)}
                className="h-5 w-5 accent-primary"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Create a new task and mark it pending or done once completed.</p>
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Add task
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-grey-light p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Pending</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">Tasks still open</h2>
            </div>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {pendingTasks.length}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {pendingTasks.length === 0 ? (
              <p className="text-sm text-foreground">No pending tasks. Add a task to get started.</p>
            ) : (
              pendingTasks.map((task) => (
                <article key={task.id} className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{task.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {task.attendance ? "Attendance required" : "No attendance required"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(task.id)}
                        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                      >
                        Mark done
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="rounded-full border border-grey-dark bg-white px-4 py-2 text-sm text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-grey-light p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Done</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">Completed tasks</h2>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {doneTasks.length}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {doneTasks.length === 0 ? (
              <p className="text-sm text-foreground">No completed tasks yet. Mark pending tasks as done.</p>
            ) : (
              doneTasks.map((task) => (
                <article key={task.id} className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{task.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {task.attendance ? "Attendance required" : "No attendance required"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(task.id)}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground border border-grey-dark"
                      >
                        Mark pending
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
