import Elysia, { t } from "elysia";
import { getPlansCache } from "@/core/cache-functions/plan";
import { models } from "@/db/model";

export const planPublicRouter = new Elysia({
  prefix: "/plan/public",
}).get(
  "/list-all",
  async () => {
    try {
      console.log("getPlansCache");

      const plans = await getPlansCache();
      console.log({
        plans,
      });

      return plans ?? [];
    } catch (error) {
      console.error(error);
      console.log("error");
      console.dir(error, { depth: null });

      return [];
    }
  },
  {
    response: t.Array(t.Object(models.select.plan)),
  },
);
