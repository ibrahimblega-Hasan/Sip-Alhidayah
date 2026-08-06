import type { PrismaClient as PrismaClientType } from "@prisma/client";

// Lazy singleton: the real @prisma/client package is only instantiated the
// first time a query actually runs (inside a request handler), never at
// module-import time. This means the app (and `next build`) never crashes
// just because DATABASE_URL isn't set yet or `prisma generate` hasn't been
// run — the demo UI works entirely off the Zustand mock stores regardless.
// Once you wire a real database, everything below "just works".

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClientType };

function createClient(): PrismaClientType {
  // Required lazily so build tooling doesn't eagerly evaluate/instantiate it
  // before `prisma generate` has run.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require("@prisma/client");
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getClient(): PrismaClientType {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createClient();
  }
  return globalForPrisma.__prisma;
}

// `prisma.santri.findMany(...)` etc. still works exactly like a normal
// PrismaClient instance — the Proxy only defers construction, not usage.
export const prisma: PrismaClientType = new Proxy({} as PrismaClientType, {
  get(_target, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
