import { os } from "@orpc/server";
import { startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { business, product } from "@/db/schema";

export const getHomePageStats = os
  .route({
    method: "GET",
    path: "/stats",
    description: "Get home page stats",
    summary: "Get home page stats",
    tags: ["Stats"],
  })
  .input(z.void())
  .output(
    z.object({
      activeBusinessesTotal: z.number(),
      activeBusinessesLastMonth: z.number(),
      productsTotal: z.number(),
      productsLastMonth: z.number(),
    }),
  )
  .handler(async () => {
    const now = new Date();
    const startThisMonth = startOfMonth(now);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = startThisMonth;
    const [
      activeBusinessesTotal,
      activeBusinessesLastMonth,
      productsTotal,
      productsLastMonth,
    ] = await Promise.all([
      // Total de negocios activos
      db
        .select({ count: count() })
        .from(business)
        .where(and(eq(business.isActive, true), eq(business.isBanned, false))),
      // Negocios activos creados el mes pasado
      db
        .select({ count: count() })
        .from(business)
        .where(
          and(
            eq(business.isActive, true),
            eq(business.isBanned, false),
            gte(business.createdAt, startLastMonth),
            lt(business.createdAt, endLastMonth),
          ),
        ),
      // Total de productos activos
      db
        .select({ count: count() })
        .from(product)
        .where(and(eq(product.active, true), eq(product.isBanned, false))),
      // Productos activos creados el mes pasado
      db
        .select({ count: count() })
        .from(product)
        .where(
          and(
            eq(product.active, true),
            eq(product.isBanned, false),
            gte(product.createdAt, startLastMonth),
            lt(product.createdAt, endLastMonth),
          ),
        ),
    ]);
    return {
      activeBusinessesTotal: activeBusinessesTotal[0].count,
      activeBusinessesLastMonth: activeBusinessesLastMonth[0].count,
      productsTotal: productsTotal[0].count,
      productsLastMonth: productsLastMonth[0].count,
    };
  });
