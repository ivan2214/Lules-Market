import { z } from "zod";

import type { Payment } from "@/db";
import type { BusinessDTO } from "../business/business.dto";

export const CreatePaymentPreferenceSchema = z.object({
  plan: z.string().min(1, "El plan es requerido"),
});

export type CreatePaymentPreferenceInput = z.infer<
  typeof CreatePaymentPreferenceSchema
>;

export type PaymentDTO = Payment & {
  // incluir relaciones si se necesitan
  business?: BusinessDTO | null;
};

export interface PaymentPreferenceResult {
  preferenceId: string | null | undefined;
  initPoint: string | null | undefined;
  sandboxInitPoint: string | null | undefined;
}
