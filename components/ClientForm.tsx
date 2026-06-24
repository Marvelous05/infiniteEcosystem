"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ClientForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) return;

    setSaving(true);
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, address }),
    });
    setSaving(false);
    router.refresh();
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 form-container">
      <h2 className="text-xl font-semibold text-foreground">Add Client</h2>
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
          Email
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-foreground">
          Phone
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-foreground">
          Address
          <input
            className="form-input w-full rounded-2xl px-4 py-3 text-sm"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
        {saving ? "Saving..." : "Add Client"}
      </button>
    </form>
  );
}
