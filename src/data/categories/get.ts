// src/data/categories/get.ts
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CategoryService } from "@/server/modules/category/service";
import { toCategoryDto } from "@/shared/utils/dto";

export async function listAllCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife("weeks");

  // ✅ Llamada directa al servicio, sin HTTP overhead
  const categories = await CategoryService.listAll();
  return categories.map(toCategoryDto);
}
