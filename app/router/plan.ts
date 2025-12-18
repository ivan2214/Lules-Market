import { os } from "@orpc/server";
import { cacheLife, cacheTag } from "next/cache";
import z from "zod";
import { db } from "@/db";
import type { Plan } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";

async function getPlansCached(): Promise<Plan[]> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.PLAN.GET_ALL);

  const plans = await db.query.plan.findMany();

  return plans;
}

export const getAllPlans = os
  .route({
    method: "GET",
    description: "Obtiene todos los planes de precios",
    tags: ["Plan", "Public"],
    summary: "Obtiene todos los planes de precios",
  })
  .output(z.array(z.custom<Plan>()))
  .handler(async () => {
    return await getPlansCached();
  });

export const planRoute = {
  getAllPlans,
};
