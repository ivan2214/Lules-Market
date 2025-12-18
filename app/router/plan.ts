import "server-only";
import { os } from "@orpc/server";
import z from "zod";
import type { Plan } from "@/db/types";
import { getPlansCache } from "./cache-functions/plan";

export const getAllPlans = os
  .route({
    method: "GET",
    description: "Obtiene todos los planes de precios",
    tags: ["Plan", "Public"],
    summary: "Obtiene todos los planes de precios",
  })
  .output(z.array(z.custom<Plan>()))
  .handler(async () => {
    return await getPlansCache();
  });

export const planRoute = {
  getAllPlans,
};
