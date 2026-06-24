import { prisma } from "../../lib/prisma";
import ProductForm from "../../components/ProductForm";
import { currency } from "../../lib/format";

type ProductRecord = {
  id: string;
  name: string;
  description: string | null;
  unitPrice: string;
  sku: string | null;
};

export default async function ProductsPage() {
  const productsRaw = await prisma.product.findMany({ orderBy: { name: "asc" } });
  const products: ProductRecord[] = productsRaw.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    unitPrice: product.unitPrice.toString(),
    sku: product.sku,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6 rounded-3xl bg-grey-dark p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Products</p>
            <h1 className="text-3xl font-semibold text-foreground">Product catalog</h1>
          </div>
          <div className="space-y-4">
            {products.length === 0 ? (
              <p className="text-sm text-foreground">No products yet. Add product prices for invoice line items.</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="rounded-3xl bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-foreground">{product.description || "No description"}</p>
                    </div>
                    <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">{currency(product.unitPrice.toString())}</span>
                  </div>
                  {product.sku ? <p className="mt-3 text-sm text-foreground">SKU: {product.sku}</p> : null}
                </div>
              ))
            )}
          </div>
        </section>
        <aside className="space-y-6">
          <ProductForm />
        </aside>
      </div>
    </main>
  );
}
