import "server-only";
import z from "zod";
import { getPlansCache } from "@/core/cache-functions/admin";
import type { Plan } from "@/db/types";
import { o } from "../context";

export const getAllPlans = o
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

export const planRouter = {
  getAllPlans,
};
