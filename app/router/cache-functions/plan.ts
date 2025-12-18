import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import type { Plan } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPlansCache(): Promise<Plan[]> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.PLAN.GET_ALL);

  const plans = await db.query.plan.findMany();

  return plans;
}
