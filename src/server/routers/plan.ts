import Elysia, { t } from "elysia";
import { getPlansCache } from "@/core/cache-functions/plan";
import { models } from "@/db/model";

export const planPublicRouter = new Elysia({
  prefix: "/plan/public",
}).get(
  "/list-all",
  async () => {
    try {
      const plans = await getPlansCache();

      return plans ?? [];
    } catch {
      return [];
    }
  },
  {
    response: t.Array(t.Object(models.select.plan)),
  },
);
