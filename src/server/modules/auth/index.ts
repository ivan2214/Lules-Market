import { APIError } from "better-auth";
import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { AuthModel } from "./model";
import { AuthService } from "./service";

const getLocalizedMessage = (
  code?: string,
  fallbackMessage?: string,
): string => {
  if (!code) return fallbackMessage || "Error desconocido";

  switch (code) {
    case "USER_ALREADY_EXISTS":
      return "Ya existe una cuenta con este email";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email o contraseña incorrectos";
    case "INVALID_PASSWORD":
      return "La contraseña no cumple con los requisitos";
    case "WEAK_PASSWORD":
      return "La contraseña debe ser más segura";
    case "INVALID_EMAIL":
      return "El formato del email no es válido";
    case "EMAIL_NOT_VERIFIED":
      return "Debes verificar tu email antes de continuar";
    case "ACCOUNT_NOT_FOUND":
      return "No existe una cuenta con este email";
    case "TOO_MANY_REQUESTS":
      return "Demasiados intentos. Espera un momento e intenta de nuevo";
    case "FAILED_TO_CREATE_USER":
      return "No se pudo crear la cuenta. Verifica los datos e intenta de nuevo";
    case "SESSION_EXPIRED":
      return "Tu sesión ha expirado. Inicia sesión de nuevo";
    case "RATE_LIMIT_EXCEEDED":
      return "Has excedido el límite de intentos. Intenta más tarde";
    default:
      return fallbackMessage || `Error: ${code}`;
  }
};

export const authController = new Elysia({
  prefix: "/auth/actions",
}).post(
  "/signup",
  async ({ body }) => {
    try {
      return await AuthService.signUp(body);
    } catch (error) {
      if (error instanceof APIError) {
        const { body, status } = error;
        const errorCode = body?.code;
        const errorMessage = body?.message;
        const errorCause = body?.cause;

        console.error("Better Auth APIError:", {
          status,
          code: errorCode,
          message: errorMessage,
          cause: errorCause,
          fullBody: body,
        });

        throw new AppError(
          "Error al crear la cuenta",
          "INTERNAL_SERVER_ERROR",
          {
            success: false,
            error: getLocalizedMessage(errorCode, errorMessage),
            code: errorCode,
            status,
            details: body?.details,
          },
        );
      }

      console.error("Error no APIError:", error);
      if (error instanceof AppError) throw error;

      return {
        success: false,
        error: "Error interno del servidor",
      };
    }
  },
  {
    body: AuthModel.signUp,
  },
);
