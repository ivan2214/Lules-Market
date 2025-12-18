import "server-only";
import { os } from "@orpc/server";
import z from "zod";
import type { CategoryWithRelations } from "@/db/types";
import { listAllCategoriesCache } from "./cache-functions/category";

export const listAllCategories = os
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

export const categoryRoute = {
  listAllCategories,
};
