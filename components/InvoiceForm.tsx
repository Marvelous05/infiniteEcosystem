"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ClientOption = { id: string; name: string };
type ProductOption = { id: string; name: string; unitPrice: string };

const getDefaultDueDate = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

type InvoiceItem = {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: string;
};

function buildItem(product?: ProductOption): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    productId: product?.id ?? "",
    description: product?.name ?? "Item description",
    quantity: 1,
    unitPrice: product?.unitPrice ?? "0",
  };
}

export default function InvoiceForm({
  clients,
  products,
}: {
  clients: ClientOption[];
  products: ProductOption[];
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [dueDate, setDueDate] = useState(
    () => getDefaultDueDate()
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    buildItem(products[0]),
  ]);
  const [saving, setSaving] = useState(false);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((item) => item.id === productId);
    setItems((current) =>
      current.map((item, idx) =>
        idx !== index
          ? item
          : {
              ...item,
              productId,
              description: product?.name ?? item.description,
              unitPrice: product?.unitPrice ?? item.unitPrice,
            }
      )
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems((current) =>
      current.map((item, idx) =>
        idx !== index ? item : { ...item, quantity }
      )
    );
  };

  const handleItemChange = (
    index: number,
    field: keyof Pick<InvoiceItem, "description" | "unitPrice">,
    value: string
  ) => {
    setItems((current) =>
      current.map((item, idx) =>
        idx !== index ? item : { ...item, [field]: value }
      )
    );
  };

  const addItem = () => {
    setItems((current) => [...current, buildItem()]);
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!clientId || items.length === 0) {
      return;
    }

    setSaving(true);
    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        dueDate,
        notes,
        items: items.map((item) => ({
          productId: item.productId || undefined,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }),
    });
    setSaving(false);
    router.refresh();
    setNotes("");
    setItems([buildItem(products[0])]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 form-container">
      <h2 className="text-xl font-semibold text-foreground">New Invoice</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-foreground">
          Client
          <select
            className="form-select w-full rounded-2xl px-4 py-3 text-sm"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-foreground">
          Due date
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="grid gap-4 rounded-3xl border p-4 bg-white sm:grid-cols-[1.5fr_1fr_1fr_120px]">
            <label className="space-y-2 text-sm text-foreground">
              Product
              <select
                className="form-select w-full rounded-2xl px-3 py-2 text-sm"
                value={item.productId}
                onChange={(event) => handleProductChange(index, event.target.value)}
              >
                <option value="">Custom item</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-foreground">
              Description
              <input
                className="form-input w-full rounded-2xl px-3 py-2 text-sm"
                value={item.description}
                onChange={(event) => handleItemChange(index, "description", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-foreground">
              Quantity
              <input
                className="form-input w-full rounded-2xl px-3 py-2 text-sm"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) => handleQuantityChange(index, Number(event.target.value))}
              />
            </label>
            <div className="flex items-end justify-between gap-3">
              <label className="flex-1 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                Unit price
                <input
                  className="form-input w-full rounded-2xl px-3 py-2 text-sm"
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unitPrice}
                  onChange={(event) => handleItemChange(index, "unitPrice", event.target.value)}
                />
              </label>
              <button type="button" className="btn-danger" onClick={() => removeItem(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn-ghost" onClick={addItem}>
        Add line item
      </button>

      <label className="space-y-2 text-sm text-foreground">
        Notes
        <textarea
          className="form-textarea w-full rounded-3xl px-4 py-3 text-sm"
          value={notes}
          rows={3}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Create an invoice for a client with one or more line items.
        </p>
        <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Saving..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}
