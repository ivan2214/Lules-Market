import { type Static, t } from "elysia";
import { BusinessSetupSchema } from "./business";

export const forgotPasswordSchema = t.Object({
  email: t.String().email(),
});

export type ForgotPasswordSchema = Static<typeof forgotPasswordSchema>;

export const otpSchema = t.Object({
  code: t
    .String()
    .length(6, "OTP code must be 6 digits")
    .regex(/^\d+$/, "OTP code must contain only digits"),
});

export type OtpSchema = Static<typeof otpSchema>;

const baseResetPasswordSchema = t.Object({
  password: t.String().min(8),
  confirmPassword: t.String().min(8),
});

export const resetPasswordSchema = baseResetPasswordSchema.refine(
  (data: Static<typeof baseResetPasswordSchema>) =>
    data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  },
);

export type ResetPasswordSchema = Static<typeof resetPasswordSchema>;

export const signInSchema = t.Object({
  email: t.String().email().min(1, "El email es requerido"),
  password: t.String().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: t.Boolean().optional(),
});

export type SignInSchema = Static<typeof signInSchema>;

export const signUpSchema = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 100,
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  email: t.String({
    minLength: 1,
    format: "email",
    message: "Dirección de correo electrónico inválida",
  }),
  password: t.String({
    minLength: 8,
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: t.Optional(
    t.String({
      minLength: 8,
      message: "La contraseña debe tener al menos 8 caracteres",
    }),
  ),
  businessData: t.Omit(BusinessSetupSchema, ["userEmail"]),
});

export type SignUpSchema = Static<typeof signUpSchema>;

export const totpSchema = t.Object({
  code: t
    .String()
    .length(6, "TOTP code must be 6 digits")
    .regex(/^\d+$/, "TOTP code must contain only digits"),
});

export type TotpSchema = Static<typeof totpSchema>;
