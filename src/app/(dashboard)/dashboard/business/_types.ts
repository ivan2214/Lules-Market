import type z from "zod";
import type { BusinessUpdateSchema } from "./_validations";

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateSchema>;
