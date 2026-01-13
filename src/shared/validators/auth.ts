import { type Static, t } from "elysia";
import { BusinessSetupSchema } from "./business";

export const forgotPasswordSchema = t.Object({
  email: t.String({
    format: "email",
    error: "Dirección de correo electrónico inválida",
  }),
});

export type ForgotPasswordSchema = Static<typeof forgotPasswordSchema>;

export const otpSchema = t.Object({
  code: t.String({
    minLength: 6,
    maxLength: 6,
    error: "El código debe tener 6 caracteres",
    pattern: "^\\d+$",
  }),
});

export type OtpSchema = Static<typeof otpSchema>;

const baseResetPasswordSchema = t.Object({
  password: t.String({
    minLength: 8,
    error: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: t.String({
    minLength: 8,
    error: "La contraseña debe tener al menos 8 caracteres",
  }),
});

// La validación de igualdad de contraseñas debe realizarse en el controlador o handler
export const resetPasswordSchema = baseResetPasswordSchema;

export type ResetPasswordSchema = Static<typeof resetPasswordSchema>;

export const signInSchema = t.Object({
  email: t.String({
    format: "email",
    error: "Dirección de correo electrónico inválida",
    minLength: 1,
  }),
  password: t.String({
    minLength: 8,
    error: "La contraseña debe tener al menos 8 caracteres",
  }),
  rememberMe: t.Optional(t.Boolean()),
});

export type SignInSchema = Static<typeof signInSchema>;

export const signUpSchema = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 100,
    error: "El nombre debe tener al menos 3 caracteres",
  }),
  email: t.String({
    minLength: 1,
    format: "email",
    error: "Dirección de correo electrónico inválida",
  }),
  password: t.String({
    minLength: 8,
    error: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: t.Optional(
    t.String({
      minLength: 8,
      error: "La contraseña debe tener al menos 8 caracteres",
    }),
  ),
  businessData: t.Omit(BusinessSetupSchema, ["userEmail"]),
});

export type SignUpSchema = Static<typeof signUpSchema>;

export const totpSchema = t.Object({
  code: t.String({
    minLength: 6,
    maxLength: 6,
    error: "El código debe tener 6 dígitos y contener solo números",
    pattern: "^\\d+$",
  }),
});

export type TotpSchema = Static<typeof totpSchema>;
