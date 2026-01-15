import "server-only";
import { api } from "@/lib/eden";

export const listAllCategories = async () => {
  const { data, error } = await api.category.public["list-all"].get();
  if (error) throw error;
  return data;
};
