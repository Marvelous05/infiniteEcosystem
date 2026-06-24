import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

// Adapter typing from the sqlite3 adapter can be incompatible with the generated
// Prisma types; cast to `any` here to preserve runtime behavior while keeping
// the rest of the codebase typed. This line intentionally uses `any`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter } as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
