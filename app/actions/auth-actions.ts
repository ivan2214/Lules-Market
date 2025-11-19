"use server";

import { APIError } from "better-auth";
import { revalidatePath } from "next/cache";
import {
  type BusinessSignInInput,
  BusinessSignInInputSchema,
  type BusinessSignUpInput,
  BusinessSignUpInputSchema,
} from "@/app/schemas/auth";
import type { ActionResult } from "@/hooks/use-action";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "../data/user/utils";

export async function businessSignInAction(
  _prevState: ActionResult,
  data: BusinessSignInInput,
): Promise<
  ActionResult & {
    isAdmin?: boolean;
    hasBusiness?: boolean;
    redirectTo?: string;
  }
> {
  const validatedFields = BusinessSignInInputSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errorMessage: "Datos inválidos" };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { errorMessage: "El usuario no existe." };
    }

    if (!existingUser.emailVerified) {
      /*       // Delete existing verification tokens
      await prisma.emailVerificationToken.deleteMany({
        where: { userId: existingUser.id },
      });

      // Generate new verification token
      const verificationToken = generateEmailVerificationToken();
      const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await prisma.emailVerificationToken.create({
        data: {
          userId: existingUser.id,
          token: verificationToken,
          expiresAt: tokenExpiresAt,
        },
      });

      await sendEmail({
        to: email,
        subject: "Verificá tu cuenta en LulesMarket",
        title: "Verificación de cuenta",
        description:
          "Gracias por registrarte en LulesMarket. Para completar tu registro, necesitamos que verifiques tu dirección de email haciendo click en el botón de abajo.",
        buttonText: "Verificar Email",
        buttonUrl: `${process.env.APP_URL}/auth/verify?token=${verificationToken}`,
        userFirstname: existingUser.name.split(" ")[0],
      }); */
      return { errorMessage: "Confirmar tu cuenta antes de ingresar." };
    }

    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
      },
    });

    const userRole = await prisma.user
      .findUnique({
        where: { id: res.user.id },
        select: { userRole: true },
      })
      .then((user) => user?.userRole);

    const hasBusiness = await prisma.business.findUnique({
      where: {
        userId: res.user.id,
      },
    });

    const isAdmin = await prisma.admin.findUnique({
      where: {
        userId: res.user.id,
      },
    });

    return {
      hasBusiness: !!hasBusiness,
      isAdmin: !!isAdmin,
      successMessage: `Bienvenido de nuevo ${res.user.name}! Has iniciado sesión correctamente`,
      redirectTo:
        userRole === "ADMIN"
          ? "/admin"
          : userRole === "SUPER_ADMIN"
            ? "/admin"
            : "/dashboard",
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "FORBIDDEN":
          return {
            errorMessage: "Confirmar tu cuenta antes de ingresar.",
          };
        case "UNAUTHORIZED":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "BAD_REQUEST":
          return { errorMessage: "Email invalido." };
        default:
          return { errorMessage: "Algo salio mal." };
      }
    }
    console.error("sign in with email has not worked", error);
    throw error;
  } finally {
    revalidatePath("/");
    revalidatePath("/auth/signin");
    revalidatePath("/auth/signup");
  }
}

export const businessSignUpAction = async (
  _prevState: ActionResult,
  data: BusinessSignUpInput,
): Promise<
  ActionResult & {
    isAdmin?: boolean;
    hasBusiness?: boolean;
  }
> => {
  try {
    const result = BusinessSignUpInputSchema.safeParse(data);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");

      return {
        errorMessage: message,
      };
    }
    const validatedData = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        errorMessage: "Ya existe un usuario con este email",
      };
    }

    const res = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: res.user.id,
      },
    });

    if (!user) {
      return {
        errorMessage: "Error al crear el usuario",
      };
    }

    const isAdmin = await prisma.admin.findUnique({
      where: {
        userId: res.user?.id,
      },
    });

    const hasBusiness = await prisma.business.findUnique({
      where: {
        userId: res.user?.id,
      },
    });

    return {
      successMessage:
        "Por favor, verifica tu email para completar el registro. Seras redirigido en unos segundos.",
      isAdmin: !!isAdmin,
      hasBusiness: !!hasBusiness,
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status as APIError["status"]) {
        case "INTERNAL_SERVER_ERROR":
          return { errorMessage: "Algo salio mal." };
        case "CONFLICT":
          return { errorMessage: "Email ya registrado." };
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "FORBIDDEN":
          return {
            errorMessage: "Confirmar tu cuenta antes de ingresar.",
          };
        case "UNAUTHORIZED":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "BAD_REQUEST":
          return { errorMessage: "Email invalido." };
        default:
          return { errorMessage: "Algo salio mal." };
      }
    }
    return {
      errorMessage: "Error al iniciar sesión",
    };
  }
};

/* export async function verifyEmail(input: {
  token: string;
}): Promise<ActionResult> {
  try {
    if (!input.token) {
      return {
        errorMessage: "Token de verificación requerido",
      };
    }

    // Find the verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token: input.token },
      include: { user: true },
    });

    if (!verificationToken) {
      return {
        errorMessage: "Token de verificación inválido o expirado",
      };
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });

      return {
        errorMessage:
          "El enlace de verificación ha expirado. Solicitá un nuevo enlace.",
      };
    }

    // Verify the user and update business status
    await prisma.$transaction(async (tx) => {
      // Update user as verified
      await tx.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true },
      });

      // Update business status to active
      await tx.business.updateMany({
        where: { userId: verificationToken.userId },
        data: { status: BusinessStatus.ACTIVE },
      });

      // Delete the verification token
      await tx.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
    });

    // Send welcome email
    await sendEmail({
      to: verificationToken.user.email,
      subject: "¡Bienvenido a LulesMarket!",
      title: "Cuenta Verificada",
      description:
        "¡Felicitaciones! Tu cuenta ha sido verificada exitosamente. Ya podés comenzar a crear ofertas y hacer crecer tu negocio con LulesMarket.",
      buttonText: "Ir al Dashboard",
      buttonUrl: `${process.env.APP_URL}/dashboard`,
      userFirstname: verificationToken.user.name.split(" ")[0],
    });

    return {
      successMessage:
        "Email verificado exitosamente. ¡Bienvenido a LulesMarket!",
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      errorMessage: "Error al verificar el email. Intentá nuevamente.",
    };
  }
}
 */
/* export async function resendVerificationEmail(input: {
  email: string;
}): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return {
        errorMessage: "Usuario no encontrado",
      };
    }

    if (user.emailVerified) {
      return {
        errorMessage: "El email ya está verificado",
      };
    }

    // Delete existing verification tokens
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new verification token
    const verificationToken = generateEmailVerificationToken();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: tokenExpiresAt,
      },
    });

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verificá tu cuenta en LulesMarket",
      title: "Verificación de cuenta",
      description:
        "Recibimos una solicitud para reenviar el enlace de verificación. Hacé click en el botón para verificar tu cuenta.",
      buttonText: "Verificar Email",
      buttonUrl: `${process.env.APP_URL}/auth/verify?token=${verificationToken}`,
      userFirstname: user.name.split(" ")[0],
    });

    return {
      successMessage:
        "Email de verificación reenviado. Revisá tu bandeja de entrada.",
    };
  } catch (error) {
    console.error("Error resending verification email:", error);
    return {
      errorMessage: "Error al reenviar el email. Intentá nuevamente.",
    };
  }
}
 */
