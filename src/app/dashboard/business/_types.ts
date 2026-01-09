import type z from "zod";
import type { BusinessUpdateSchema } from "@/shared/validators/business";

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateSchema>;
