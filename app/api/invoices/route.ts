import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  type InvoiceItem = {
    productId?: string;
    description: string;
    quantity: number;
    unitPrice: string;
    total: string;
  };

  const items: InvoiceItem[] = (body.items ?? []).map((item: unknown) => {
    const invoiceItem = item as {
      productId?: string;
      description: string;
      quantity: number | string;
      unitPrice: number | string;
    };

    return {
      productId: invoiceItem.productId || undefined,
      description: invoiceItem.description,
      quantity: Number(invoiceItem.quantity),
      unitPrice: String(invoiceItem.unitPrice),
      total: String((Number(invoiceItem.quantity) * Number(invoiceItem.unitPrice)).toFixed(2)),
    };
  });

  const subtotal = items.reduce((sum: number, item) => sum + Number(item.total), 0);
  const tax = Number((subtotal * 0.07).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const invoice = await prisma.invoice.create({
    data: {
      number: `INV-${Date.now()}`,
      status: "DRAFT",
      issueDate: new Date(),
      dueDate: new Date(body.dueDate),
      client: { connect: { id: body.clientId } },
      subtotal: String(subtotal.toFixed(2)),
      tax: String(tax.toFixed(2)),
      total: String(total.toFixed(2)),
      notes: body.notes ?? null,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      },
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
