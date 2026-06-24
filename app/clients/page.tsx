import { prisma } from "../../lib/prisma";
import ClientForm from "../../components/ClientForm";

type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export default async function ClientsPage() {
  const clients: ClientRecord[] = await prisma.client.findMany({ orderBy: { name: "asc" } });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6 rounded-3xl bg-grey-dark p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Clients</p>
            <h1 className="text-3xl font-semibold text-foreground">Client directory</h1>
          </div>
          <div className="space-y-4">
            {clients.length === 0 ? (
              <p className="text-sm text-foreground">No clients yet. Add one to begin creating invoices.</p>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="rounded-3xl bg-white p-5">
                  <p className="text-lg font-semibold text-foreground">{client.name}</p>
                  <p className="text-sm text-foreground">{client.email || "No email provided"}</p>
                  <p className="text-sm text-foreground">{client.phone || "No phone"}</p>
                  {client.address ? <p className="text-sm text-foreground">{client.address}</p> : null}
                </div>
              ))
            )}
          </div>
        </section>
        <aside className="space-y-6">
          <ClientForm />
        </aside>
      </div>
    </main>
  );
}
