import { os } from "@orpc/server";
import z from "zod";
import { db } from "@/db";
import type { CategoryWithRelations } from "@/db/types";

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
    const categories = await db.query.category.findMany({
      with: {
        products: true,
      },
    });

    return categories;
  });

export const categoryRoute = {
  listAllCategories,
};
