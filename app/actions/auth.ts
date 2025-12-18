"use server";

import { os } from "@orpc/server";
import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import {
  BusinessSignInInputSchema,
  BusinessSignUpInputSchema,
} from "@/app/schemas/auth";
import { db, schema } from "@/db";
import { auth, syncUserRole } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getUserByEmail } from "../data/user/utils";

// ============================================================================
// BUSINESS SIGN IN
// ============================================================================

const businessSignInProcedure = os
  .input(BusinessSignInInputSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;

    try {
      // Verificar si existe el usuario
      const existingUser = await getUserByEmail(email);
      if (!existingUser) {
        throw new Error("El usuario no existe.");
      }

      // Sincronizar rol de usuario
      const syncUserRoleResult = await syncUserRole(existingUser);

      if (syncUserRoleResult.success) {
        await auth.api.signInEmail({
          body: { email, password, rememberMe: true },
        });

        revalidatePath("/");
        revalidatePath("/auth/signin");
        revalidatePath("/auth/signup");

        return {
          message: `Bienvenido de nuevo ${existingUser.name}! Has iniciado sesión correctamente`,
          hasVerified: true,
          isAdmin: true,
          hasBusiness: false,
        };
      }

      // Sign in normal
      const res = await auth.api.signInEmail({
        body: { email, password, rememberMe: true },
      });

      // Consultas paralelas para mejor performance
      const [user, hasBusiness, isAdmin] = await Promise.all([
        db.query.user.findFirst({
          where: eq(schema.user.id, res.user.id),
        }),
        db.query.business.findFirst({
          where: eq(schema.business.userId, res.user.id),
        }),
        db.query.admin.findFirst({
          where: eq(schema.admin.userId, res.user.id),
        }),
      ]);

      // Revalidar paths
      revalidatePath("/");
      revalidatePath("/auth/signin");
      revalidatePath("/auth/signup");

      return {
        message: `Bienvenido de nuevo ${res.user.name}! Has iniciado sesión correctamente`,
        hasBusiness: !!hasBusiness,
        isAdmin: !!isAdmin,
        hasVerified: !!user?.emailVerified,
      };
    } catch (error) {
      // Mapeo de errores de better-auth
      if (error instanceof APIError) {
        switch (error.status) {
          case "UNPROCESSABLE_ENTITY":
          case "UNAUTHORIZED":
            throw new Error("Email o contraseña incorrectos.");
          case "FORBIDDEN":
            throw new Error("Confirmar tu cuenta antes de ingresar.");
          case "BAD_REQUEST":
            throw new Error("Email inválido.");
          default:
            throw new Error("Algo salió mal.");
        }
      }

      // Re-lanzar error si es mensaje custom
      if (error instanceof Error) {
        throw error;
      }

      console.error("sign in with email has not worked", error);
      throw new Error("Algo salió mal.");
    }
  });

/**
 * Server Action para Sign In
 * Usa esto en el cliente con useServerAction
 */
export const businessSignInAction = businessSignInProcedure.actionable();

// ============================================================================
// BUSINESS SIGN UP
// ============================================================================

const businessSignUpProcedure = os
  .input(BusinessSignUpInputSchema)
  .handler(async ({ input }) => {
    const { email, password, name } = input;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await db.query.user.findFirst({
        where: eq(schema.user.email, email),
      });

      if (existingUser) {
        throw new Error("Ya existe un usuario con este email");
      }

      // Crear usuario
      const res = await auth.api.signUpEmail({
        body: { email, password, name },
      });

      // Sincronizar rol
      const syncUserRoleResult = await syncUserRole(res.user);

      if (syncUserRoleResult.success) {
        updateTag(CACHE_TAGS.DEV_TOOLS.GET_ALL);

        return {
          message: `Bienvenido ${res.user.name}! Has iniciado sesión correctamente`,
          isAdmin: true,
          hasVerified: true,
        };
      }

      // Verificar creación
      const user = await db.query.user.findFirst({
        where: eq(schema.user.id, res.user.id),
      });

      if (!user) {
        throw new Error("Error al crear el usuario");
      }

      updateTag(CACHE_TAGS.DEV_TOOLS.GET_ALL);

      return {
        message:
          "Por favor, verifica tu email para completar el registro. Serás redirigido en unos segundos.",
        hasVerified: true,
        isAdmin: false,
      };
    } catch (error) {
      // Mapeo de errores de better-auth
      if (error instanceof APIError) {
        switch (error.status) {
          case "CONFLICT":
            throw new Error("Email ya registrado.");
          case "UNPROCESSABLE_ENTITY":
          case "UNAUTHORIZED":
            throw new Error("Email o contraseña incorrectos.");
          case "FORBIDDEN":
            throw new Error("Confirmar tu cuenta antes de ingresar.");
          case "BAD_REQUEST":
            throw new Error("Email inválido.");
          case "INTERNAL_SERVER_ERROR":
          default:
            throw new Error("Algo salió mal.");
        }
      }

      // Re-lanzar error si es mensaje custom
      if (error instanceof Error) {
        throw error;
      }

      console.error("sign up with email has not worked", error);
      throw new Error("Error al iniciar sesión");
    }
  });

/**
 * Server Action para Sign Up
 * Usa esto en el cliente con useServerAction
 */
export const businessSignUpAction = businessSignUpProcedure.actionable();
