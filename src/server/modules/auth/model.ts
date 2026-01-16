import { t } from "elysia";
import { BusinessSetupSchema } from "@/shared/validators/business";

export namespace AuthModel {
  const ServerImageInputSchema = t.Object({
    isMainImage: t.Boolean(),
    file: t.Optional(t.Any()),
    key: t.Optional(t.String()),
  });

  export const signUp = t.Object({
    name: t.String(),
    email: t.String(),
    password: t.String(),
    businessData: t.Composite([
      t.Omit(BusinessSetupSchema, ["userEmail", "logo", "coverImage"]),
      t.Object({
        logo: ServerImageInputSchema,
        coverImage: ServerImageInputSchema,
      }),
    ]),
  });

  export type SignUp = typeof signUp.static;

  export const signUpOutput = t.Object({
    success: t.Boolean(),
    message: t.Optional(t.String()),
  });
  export type SignUpOutput = typeof signUpOutput.static;
}
