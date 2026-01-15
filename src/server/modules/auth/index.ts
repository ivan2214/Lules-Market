import { APIError } from "better-auth";
import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { getSessionFromHeaders } from "@/server/plugins/auth";
import { AuthModel } from "./model";
import { AuthService } from "./service";

const getLocalizedMessage = (
  code?: string,
  fallbackMessage?: string,
): string => {
  if (!code) return fallbackMessage || "Error desconocido";

  switch (code) {
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
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
  prefix: "/actions",
})
  .post(
    "/signup",
    async ({ body }) => {
      console.log({
        body,
      });

      try {
        const response = await AuthService.signUp(body);
        console.log({
          response,
        });

        return response;
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

          const localizedMessage = getLocalizedMessage(errorCode, errorMessage);

          throw new AppError(localizedMessage, "BAD_REQUEST", {
            success: false,
            error: localizedMessage,
            code: errorCode,
            status,
            details: body?.details,
          });
        }

        console.error("Error no APIError:", error);
        if (error instanceof AppError) throw error;

        throw new AppError(
          "Error interno del servidor",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      body: AuthModel.signUp,
    },
  )
  .get("/get-session", async ({ request: { headers } }) => {
    if (!headers) {
      throw new AppError("No headers provided", "BAD_REQUEST");
    }
    const session = await getSessionFromHeaders(headers);
    return session;
  });
