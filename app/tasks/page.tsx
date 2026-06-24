import TaskManager from "../../components/TaskManager";

export default function TasksPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <div className="space-y-6 rounded-3xl bg-grey-light p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Tasks</p>
          <h1 className="text-3xl font-semibold text-foreground">Attendance task manager</h1>
          <p className="max-w-3xl text-sm leading-6 text-foreground">
            Track tasks that require attendance, then move them between pending and done. Use this board to keep task status visible and organized.
          </p>
        </div>
      </div>
      <TaskManager />
    </main>
  );
}
