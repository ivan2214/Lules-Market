import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const secondsPerMinute = 60;
const minutesInLocal = 1;
const minutesInProduction = 2;
const secondsInLocal = minutesInLocal * secondsPerMinute;
const secondsInProduction = minutesInProduction * secondsPerMinute;

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter: pool,
  transactionOptions: {
    // espera de 2 min en produccion y en local de 60 seg
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
