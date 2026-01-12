import { APIError } from "better-auth";
import Elysia, { t } from "elysia";
import { auth } from "@/lib/auth";
import { api } from "@/lib/eden";
import { AppError } from "../errors";

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

export const authRouter = new Elysia({
  prefix: "/auth/actions",
}).post(
  "/signup",
  async ({ body }) => {
    try {
      const { name, email, password, businessData } = body;
      const {
        address,
        category,
        coverImage,
        description,
        logo,
        name: businessName,
        facebook,
        instagram,
        phone,
        tags,
        website,
        whatsapp,
      } = businessData;

      console.log("businessData", businessData);

      const { user } = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });

      if (!user) {
        throw new AppError("Usuario no encontrado", "NOT_FOUND", {
          message: "Usuario no encontrado",
        });
      }

      const { data } = await api.business.public.setup.post({
        coverImage,
        logo,
        name: businessName,
        address,
        category,
        description,
        facebook,
        instagram,
        phone,
        tags,
        website,
        whatsapp,
        userEmail: user.email,
      });
      return {
        success: !!data?.success,
      };
    } catch (error) {
      if (error instanceof APIError) {
        const { body, status } = error;

        // Validar que body existe antes de acceder a sus propiedades
        const errorCode = body?.code;
        const errorMessage = body?.message;
        const errorCause = body?.cause;

        // Log detallado para debugging
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
            details: body?.details, // Si hay detalles adicionales
          },
        );
      }

      // Manejar otros tipos de error
      console.error("Error no APIError:", error);
      return {
        success: false,
        error: "Error interno del servidor",
      };
    }
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
      businessData: t.Object({
        name: t.String(),
        address: t.String(),
        category: t.String(),
        coverImage: t.String(),
        description: t.String(),
        logo: t.String(),
        facebook: t.String(),
        instagram: t.String(),
        phone: t.String(),
        tags: t.Array(t.String()),
        website: t.String(),
        whatsapp: t.String(),
      }),
    }),
  },
);
