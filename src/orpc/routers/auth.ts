import { ORPCError } from "@orpc/client";
import { APIError } from "better-auth";
import z from "zod";
import { auth } from "@/lib/auth";
import { o } from "@/orpc/context";
import { client } from "@/orpc/index";
import { signUpSchema } from "@/shared/validators/auth";
import type { BusinessSetupSchema } from "@/shared/validators/business";

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

const signup = o
  .route({
    method: "POST",
    path: "/sign-up",
  })
  .input(signUpSchema.omit({ confirmPassword: true }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    try {
      const { name, email, password, businessData } = input;
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
      } = businessData as z.infer<typeof BusinessSetupSchema>;

      console.log("businessData", businessData);

      const { user } = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });

      if (!user) {
        return {
          success: false,
        };
      }

      const { success } = await client.business.public.businessSetup({
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
        success: !!success,
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

        throw new ORPCError("Error al crear la cuenta", {
          data: {
            success: false,
            error: getLocalizedMessage(errorCode, errorMessage),
            code: errorCode,
            status,
            details: body?.details, // Si hay detalles adicionales
          },
        });
      }

      // Manejar otros tipos de error
      console.error("Error no APIError:", error);
      return {
        success: false,
        error: "Error interno del servidor",
      };
    }
  });

export const authRouter = {
  signup,
};
