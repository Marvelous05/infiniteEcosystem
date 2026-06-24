import TaskManager from "../../components/TaskManager";

export default function TasksPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10">
      <section className="panel overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 backdrop-blur-md">
        <div className="space-y-4">
          <p className="section-title">Tasks</p>
          <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
            Attendance task manager
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted">
            Track attendance-focused tasks, move items from pending to done, and keep your daily workflow tidy in a modern, easy-to-use board.
          </p>
        </div>
      </section>
      <TaskManager />
    </main>
  );
}
