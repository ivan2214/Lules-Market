"use server";

import { APIError } from "better-auth";
import {
  type BusinessSignInInput,
  BusinessSignInInputSchema,
} from "@/app/schemas/auth";
import type { ActionResult } from "@/hooks/use-action";
import { auth } from "@/lib/auth";

export const businessSignInAction = async (
  _prevState: ActionResult,
  data: BusinessSignInInput,
): Promise<ActionResult> => {
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
    const { redirect, token, url, user } = await auth.api.signInEmail({
      body: {
        email: validatedData.data.email,
        password: validatedData.data.password,
        rememberMe: true,
        callbackURL: "/dashboard",
      },
    });

    console.log({
      redirect,
      token,
      url,
      user,
    });
    return {
      successMessage: "Inicio de sesión exitoso",
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
