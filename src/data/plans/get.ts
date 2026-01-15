import "server-only";
import { api } from "@/lib/eden";

export const getPlans = async () => {
  const { data, error } = await api.plan.public["list-all"].get();
  if (error) throw error;
  return data;
};
