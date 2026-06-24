import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { currency, formatDate } from "../../../lib/format";

type Props = {
  params: { id: string };
};

type InvoiceItemRecord = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
  product: { name: string } | null;
};

type InvoiceRecord = {
  number: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: string;
  tax: string;
  total: string;
  notes: string | null;
  client: { name: string; email: string | null; phone: string | null; address: string | null };
  items: InvoiceItemRecord[];
};

export default async function InvoiceDetailPage({ params }: Props) {
  const invoice = (await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      items: { include: { product: true } },
    },
  })) as InvoiceRecord | null;

  if (!invoice) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-10">
      <section className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Invoice detail</p>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">{invoice.number}</h1>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
            <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 dark:bg-zinc-900 dark:text-slate-200">
              {invoice.status}
            </p>
          </div>
        </div>

        <div className="grid gap-6 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Client</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{invoice.client.name}</p>
            {invoice.client.email ? <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.client.email}</p> : null}
            {invoice.client.phone ? <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.client.phone}</p> : null}
            {invoice.client.address ? <p className="text-sm text-slate-600 dark:text-slate-300">{invoice.client.address}</p> : null}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Dates</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Issue date: {formatDate(invoice.issueDate)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Due date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-grey-light">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-foreground">
            <thead className="bg-grey-dark text-foreground">
              <tr>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit price</th>
                <th className="px-6 py-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-t border-grey-dark">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{item.description}</div>
                    {item.product ? <div className="text-xs text-muted">{item.product.name}</div> : null}
                  </td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{currency(item.unitPrice.toString())}</td>
                  <td className="px-6 py-4">{currency(item.total.toString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl bg-grey-light p-6 text-sm text-foreground sm:flex-row sm:items-center sm:justify-end">
          <div className="grid gap-3 max-w-xs w-full">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currency(invoice.subtotal.toString())}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{currency(invoice.tax.toString())}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{currency(invoice.total.toString())}</span>
            </div>
          </div>
        </div>

        {invoice.notes ? (
          <div className="rounded-3xl bg-grey-light p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Notes</h2>
            <p className="mt-3 text-sm text-foreground">{invoice.notes}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
