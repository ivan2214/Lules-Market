import { z } from "zod";

import type { PaymentWithRelations } from "@/db/types";

export const CreatePaymentPreferenceSchema = z.object({
  plan: z.string().min(1, "El plan es requerido"),
});

export type CreatePaymentPreferenceInput = z.infer<
  typeof CreatePaymentPreferenceSchema
>;

export type PaymentDTO = PaymentWithRelations;

export interface PaymentPreferenceResult {
  preferenceId: string | null | undefined;
  initPoint: string | null | undefined;
  sandboxInitPoint: string | null | undefined;
}
