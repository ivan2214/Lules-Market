"use server";

import { APIError } from "better-auth";
import {
  type BusinessSignInInput,
  BusinessSignInInputSchema,
  type BusinessSignUpInput,
  BusinessSignUpInputSchema,
} from "@/app/schemas/auth";
import type { ActionResult } from "@/hooks/use-action";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const businessSignInAction = async (
  _prevState: ActionResult,
  data: BusinessSignInInput,
): Promise<
  ActionResult & {
    isAdmin?: boolean;
    hasBusiness?: boolean;
  }
> => {
  try {
    const validatedData = BusinessSignInInputSchema.safeParse(data);
    if (!validatedData.success) {
      const message = validatedData.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");

      return {
        errorMessage: message,
      };
    }
    const { user } = await auth.api.signInEmail({
      body: {
        email: validatedData.data.email,
        password: validatedData.data.password,
        rememberMe: true,
      },
    });

    if (!user) {
      return {
        errorMessage: "Error al iniciar sesión",
      };
    }

    const isAdmin = await prisma.admin.findUnique({
      where: {
        userId: user.id,
      },
    });

    const hasBusiness = await prisma.business.findUnique({
      where: {
        userId: user.id,
      },
    });

    return {
      successMessage: "Inicio de sesión exitoso",
      isAdmin: !!isAdmin,
      hasBusiness: !!hasBusiness,
    };
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.status);

      switch (error.status as APIError["status"]) {
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
    const validatedData = BusinessSignUpInputSchema.safeParse(data);
    if (!validatedData.success) {
      const message = validatedData.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");

      return {
        errorMessage: message,
      };
    }
    const { name, email, password } = validatedData.data;

    const exists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (exists) {
      return {
        errorMessage: "Email ya registrado.",
      };
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!user) {
      return {
        errorMessage: "Error al registrar",
      };
    }

    const isAdmin = await prisma.admin.findUnique({
      where: {
        userId: user.id,
      },
    });

    const hasBusiness = await prisma.business.findUnique({
      where: {
        userId: user.id,
      },
    });

    return {
      successMessage: "Registro exitoso",
      isAdmin: !!isAdmin,
      hasBusiness: !!hasBusiness,
    };
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.status);

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
