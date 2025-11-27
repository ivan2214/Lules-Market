import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const milisecondsPerMinute = 60 * 1000;
const minutesInLocal = 2;
const minutesInProduction = 4;
const secondsInLocal = minutesInLocal * milisecondsPerMinute;
const secondsInProduction = minutesInProduction * milisecondsPerMinute;

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter: pool,
  transactionOptions: {
    // espera de 4 min en produccion y en local de 60 seg
    maxWait:
      process.env.NODE_ENV === "production"
        ? secondsInProduction
        : secondsInLocal,
    timeout:
      process.env.NODE_ENV === "production"
        ? secondsInProduction
        : secondsInLocal,
  },
});

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
