import "server-only";

import z from "zod";
import { listAllCategoriesCache } from "@/core/cache-functions/category";
import type { CategoryWithRelations } from "@/db/types";
import { o } from "../context";

export const listAllCategories = o
  .route({
    method: "GET",
    description: "Listar todas las categorías",
    summary: "Listar todas las categorías",
    tags: ["Categorías"],
    outputStructure: "compact",
  })
  .output(z.array(z.custom<CategoryWithRelations>()))
  .handler(async () => {
    const categories = await listAllCategoriesCache();

    return categories;
  });

export const categoryRouter = {
  listAllCategories,
};
