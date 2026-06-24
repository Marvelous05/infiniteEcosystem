import { prisma } from "../../lib/prisma";
import { currency, formatDate } from "../../lib/format";
import InvoiceForm from "../../components/InvoiceForm";

type ClientRecord = {
  id: string;
  name: string;
};

type ProductRecord = {
  id: string;
  name: string;
  unitPrice: string;
};

type InvoiceCardRecord = {
  id: string;
  number: string;
  dueDate: Date;
  issueDate: Date;
  total: string;
  status: string;
  client: { name: string };
};

export default async function InvoicesPage() {
  const clients: ClientRecord[] = await prisma.client.findMany({ orderBy: { name: "asc" } });
  const productsRaw = await prisma.product.findMany({ orderBy: { name: "asc" } });
  const products: ProductRecord[] = productsRaw.map((product) => ({
    id: product.id,
    name: product.name,
    unitPrice: product.unitPrice.toString(),
  }));
  const invoicesRaw = await prisma.invoice.findMany({
    orderBy: { issueDate: "desc" },
    include: { client: true },
    take: 12,
  });
  const invoices: InvoiceCardRecord[] = invoicesRaw.map((invoice) => ({
    id: invoice.id,
    number: invoice.number,
    dueDate: invoice.dueDate,
    issueDate: invoice.issueDate,
    total: invoice.total.toString(),
    status: invoice.status,
    client: { name: invoice.client.name },
  }));

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 sm:px-10">
      <section className="space-y-4 rounded-3xl bg-grey-light p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">
              Invoicing
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              Invoice dashboard
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-foreground">
            Create, review, and manage invoices for Infinite Biomedical Solutions. Use this dashboard to track due dates, client totals, and invoice status.
          </p>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6 rounded-3xl bg-grey-light p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-foreground">Recent invoices</h2>
            <span className="rounded-full bg-grey-dark px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              {invoices.length} records
            </span>
          </div>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <a
                key={invoice.id}
                href={`/invoices/${invoice.id}`}
                className="flex flex-col gap-3 rounded-3xl bg-white p-5 text-foreground transition hover:bg-slate-100"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{invoice.number}</p>
                    <p className="text-sm text-muted">{invoice.client.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold">{currency(invoice.total.toString())}</p>
                    <p className="text-sm text-muted">Due {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-foreground">
                  <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white">
                    {invoice.status}
                  </span>
                  <span>{formatDate(invoice.issueDate)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <InvoiceForm clients={clients} products={products} />
          <section className="rounded-3xl bg-grey-light p-6">
            <h2 className="text-xl font-semibold text-foreground">Quick links</h2>
            <div className="mt-4 space-y-3 text-sm text-foreground">
              <p>• Add clients and products before creating invoices.</p>
              <p>• Click any invoice to view its detail page.</p>
              <p>• Use the Products page to keep pricing up to date.</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
