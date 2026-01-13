import { t } from "elysia";
import { BusinessSetupSchema } from "@/shared/validators/business";

export namespace AuthModel {
  export const signUp = t.Object({
    name: t.String(),
    email: t.String(),
    password: t.String(),
    businessData: BusinessSetupSchema,
  });

  export type signUp = typeof signUp.static;
}
