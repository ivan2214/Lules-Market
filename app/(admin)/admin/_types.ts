import type z from "zod";
import type { PlanFormSchema } from "./_validations";

export type PlanFormInput = z.infer<typeof PlanFormSchema>;
