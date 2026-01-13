import Elysia, { t } from "elysia";
import { listAllCategoriesCache } from "@/core/cache-functions/category";
import { models } from "@/db/model";

export const categoryPublicRouter = new Elysia({
  prefix: "/category/public",
}).get(
  "/list-all",
  async () => {
    const categories = await listAllCategoriesCache();

    return categories;
  },
  {
    response: t.Array(t.Object(models.select.category)),
  },
);
