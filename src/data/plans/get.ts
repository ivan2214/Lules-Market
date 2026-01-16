import "server-only";
import { cache } from "react";
import { api } from "@/lib/eden";

export const getPlans = cache(async () => {
  const { data, error } = await api.plan.public["list-all"].get();
  if (error) throw error;
  return data;
});
