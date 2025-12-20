import type z from "zod";
import type {
  BusinessSetupSchema,
  BusinessSignInInputSchema,
  BusinessSignUpInputSchema,
  ForgotPasswordSchema,
} from "./_validations";

export type BusinessSignInInput = z.infer<typeof BusinessSignInInputSchema>;
export type BusinessSignUpInput = z.infer<typeof BusinessSignUpInputSchema>;
export type BusinessSetupInput = z.infer<typeof BusinessSetupSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
