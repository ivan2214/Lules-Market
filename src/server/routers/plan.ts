import Elysia, { t } from "elysia";
import { getPlansCache } from "@/core/cache-functions/plan";
import type { Plan } from "@/db/types";

export const planPublicRouter = new Elysia({
  prefix: "/plan/public",
}).get(
  "/list-all",
  async () => {
    return await getPlansCache();
  },
  {
    response: t.Array(t.Unsafe<Plan>()),
  },
);
