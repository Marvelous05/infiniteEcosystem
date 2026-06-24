import Link from "next/link";
import TaskAnalytics from "../components/TaskAnalytics";
import { prisma } from "../lib/prisma";

type HomeMetrics = {
  totalProducts: number;
  totalClients: number;
  totalInvoices: number;
};

export default async function Home() {
  const [totalProducts, totalClients, totalInvoices] = await Promise.all([
    prisma.product.count(),
    prisma.client.count(),
    prisma.invoice.count(),
  ]);

  const metrics: HomeMetrics = {
    totalProducts,
    totalClients,
    totalInvoices,
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-92px)] max-w-7xl space-y-10 px-6 py-10 sm:px-10">
      <section className="panel overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 backdrop-blur-md">
        <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr] lg:items-end">
          <div className="space-y-6">
            <p className="section-title">INFINITE BIOMEDICAL SOLUTIONS</p>
            <h1 className="section-heading tracking-tight text-slate-950">
              Modern billing for healthcare services, simplified.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Keep invoices, clients, products, and daily task workflows beautifully organized with a clean, brand-driven dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/invoices">
                Create invoice
              </Link>
              <Link className="btn-secondary" href="/tasks">
                View tasks
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="stat-card bg-primary text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-white/70">Products</p>
              <p className="mt-4 text-4xl font-semibold">{metrics.totalProducts}</p>
              <p className="mt-2 text-sm text-white/80">Active product items in your catalog.</p>
            </div>

            <div className="stat-card bg-white">
              <p className="text-sm uppercase tracking-[0.18em] text-muted">Clients</p>
              <p className="mt-4 text-4xl font-semibold text-foreground">{metrics.totalClients}</p>
              <p className="mt-2 text-sm text-muted">Clients managed in your system.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="stat-card">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Invoices</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">{metrics.totalInvoices}</p>
          <p className="mt-2 text-sm text-muted">Invoices issued to date.</p>
        </div>
        <div className="stat-card">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Workflows</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">Task flow</p>
          <p className="mt-2 text-sm text-muted">Track attendance tasks and completion rates at a glance.</p>
        </div>
        <div className="stat-card bg-surface border border-primary/10">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Next step</p>
          <p className="mt-4 text-2xl font-semibold text-primary">Add a new client, product, or invoice</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-secondary" href="/clients">
              Add client
            </Link>
            <Link className="btn-secondary" href="/products">
              Add product
            </Link>
          </div>
        </div>
      </section>

      <TaskAnalytics />
    </main>
  );
}
