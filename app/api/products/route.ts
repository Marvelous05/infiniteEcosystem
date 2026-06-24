import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      sku: body.sku ?? null,
      unitPrice: body.unitPrice,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
