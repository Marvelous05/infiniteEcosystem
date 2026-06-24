"use client";

import { useState } from "react";

type TaskStatus = "pending" | "done";

type Task = {
  id: string;
  title: string;
  attendance: boolean;
  status: TaskStatus;
  createdAt: string;
};

const STORAGE_KEY = "infinite-biomed-tasks";

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

export default function TaskAnalytics() {
  const [tasks] = useState<Task[]>(() => loadTasks());
  const pending = tasks.filter((task) => task.status === "pending").length;
  const completed = tasks.filter((task) => task.status === "done").length;

  return (
    <section className="rounded-3xl bg-grey-light p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Tasks</p>
          <h2 className="text-2xl font-semibold text-foreground">Attendance task status</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Pending and completed task totals are loaded from your local task board so you can keep the dashboard up to date.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Pending tasks</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">{pending}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Completed tasks</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">{completed}</p>
        </div>
      </div>
    </section>
  );
}
