import "server-only";
import { cache } from "react";
import { api } from "@/lib/eden";
import { toCategoryDto } from "@/shared/utils/dto";

export const listAllCategories = cache(async () => {
  const { data, error } = await api.category.public["list-all"].get();
  if (error) throw error;
  return data.map(toCategoryDto);
});
