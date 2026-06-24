"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("0");
  const [sku, setSku] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) return;

    setSaving(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, unitPrice, sku }),
    });
    setSaving(false);
    router.refresh();
    setName("");
    setDescription("");
    setUnitPrice("0");
    setSku("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 form-container">
      <h2 className="text-xl font-semibold text-foreground">Add Product</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-foreground">
          Name
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        <label className="space-y-2 text-sm text-foreground">
          Unit price
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            required
          />
        </label>
        <label className="space-y-2 text-sm text-foreground sm:col-span-2">
          Description
          <textarea
            className="form-textarea w-full rounded-3xl px-4 py-3 text-sm"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-foreground sm:col-span-2">
          SKU
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
        {saving ? "Saving..." : "Add Product"}
      </button>
    </form>
  );
}
