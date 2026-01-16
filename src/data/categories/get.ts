import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { api } from "@/lib/eden";
import { toCategoryDto } from "@/shared/utils/dto";

export async function listAllCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife("weeks");
  const { data, error } = await api.category.public["list-all"].get();
  if (error) throw error;
  return data.map(toCategoryDto);
}
