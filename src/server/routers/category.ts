import Elysia, { t } from "elysia";
import { listAllCategoriesCache } from "@/core/cache-functions/category";
import type { Category } from "@/db/types";

export const categoryPublicRouter = new Elysia({
  prefix: "/category/public",
}).get(
  "/list-all",
  async () => {
    const categories = await listAllCategoriesCache();

    return categories;
  },
  {
    response: t.Array(t.Unsafe<Category>()),
  },
);
