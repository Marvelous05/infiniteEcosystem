import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const body = await request.json();
  const client = await prisma.client.create({
    data: {
      name: body.name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      address: body.address ?? null,
    },
  });
  return NextResponse.json(client, { status: 201 });
}
