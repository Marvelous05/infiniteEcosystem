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
    <main className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl space-y-10 px-6 py-10 sm:px-10">
      <section className="rounded-3xl bg-grey-light p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Infinite Biomedical Solutions</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Business dashboard & analytics
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              See the latest numbers for your products, clients, invoices, and attendance tasks in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary" href="/tasks">
              View Tasks
            </Link>
            <Link className="btn-ghost" href="/invoices">
              View Invoices
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Products</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">{metrics.totalProducts}</p>
          <p className="mt-2 text-sm text-muted">Total number of saved products.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Clients</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">{metrics.totalClients}</p>
          <p className="mt-2 text-sm text-muted">Total number of active clients.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-muted">Invoices</p>
          <p className="mt-4 text-4xl font-semibold text-foreground">{metrics.totalInvoices}</p>
          <p className="mt-2 text-sm text-muted">Total issued invoices.</p>
        </div>
      </section>

      <TaskAnalytics />
    </main>
  );
}
