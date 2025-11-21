import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "@/env";
import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
