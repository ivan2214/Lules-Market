"use server";

import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import {
  type BusinessSignInInput,
  BusinessSignInInputSchema,
  type BusinessSignUpInput,
  BusinessSignUpInputSchema,
} from "@/app/schemas/auth";
import { db, schema } from "@/db";
import type { ActionResult } from "@/hooks/use-action";
import { auth } from "@/lib/auth";
import { getUserByEmail } from "../data/user/utils";

export async function businessSignInAction(
  _prevState: ActionResult,
  data: BusinessSignInInput,
): Promise<
  ActionResult & {
    isAdmin?: boolean;
    hasBusiness?: boolean;
    hasVerified?: boolean;
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
      return { errorMessage: "Confirmar tu cuenta antes de ingresar." };
    }

    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
      },
    });

    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, res.user.id),
    });

    const hasBusiness = await db.query.business.findFirst({
      where: eq(schema.business.userId, res.user.id),
    });

    const isAdmin = await db.query.admin.findFirst({
      where: eq(schema.admin.userId, res.user.id),
    });

    return {
      hasBusiness: !!hasBusiness,
      isAdmin: !!isAdmin,
      successMessage: `Bienvenido de nuevo ${res.user.name}! Has iniciado sesión correctamente`,
      hasVerified: !!user?.emailVerified,
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "FORBIDDEN":
          return {
            errorMessage: "Confirmar tu cuenta antes de ingresar.",
          };
        case "UNAUTHORIZED":
          return { errorMessage: "Email o contraseña incorrectos." };
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
): Promise<ActionResult> => {
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
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.email, validatedData.email),
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

    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, res.user.id),
    });

    if (!user) {
      return {
        errorMessage: "Error al crear el usuario",
      };
    }

    return {
      successMessage:
        "Por favor, verifica tu email para completar el registro. Seras redirigido en unos segundos.",
    };
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status as APIError["status"]) {
        case "INTERNAL_SERVER_ERROR":
          return { errorMessage: "Algo salio mal." };
        case "CONFLICT":
          return { errorMessage: "Email ya registrado." };
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "FORBIDDEN":
          return {
            errorMessage: "Confirmar tu cuenta antes de ingresar.",
          };
        case "UNAUTHORIZED":
          return { errorMessage: "Email o contraseña incorrectos." };
        case "BAD_REQUEST":
          return { errorMessage: "Email invalido." };
        default:
          return { errorMessage: "Algo salio mal." };
      }
    }
    return {
      errorMessage: "Error al iniciar sesión",
    };
  } finally {
    updateTag("dev-tools");
  }
};

/* export async function verifyEmail(input: {
  token: string;
}): Promise<ActionResult> {
  // TODO: Implement with Drizzle when needed
}
 */
/* export async function resendVerificationEmail(input: {
  email: string;
}): Promise<ActionResult> {
  // TODO: Implement with Drizzle when needed
}
 */
