"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentSession } from "@/data/session/get-current-session";
import type { UserRole } from "@/db/types";

export async function authenticate(args?: {
  role?: UserRole;
  redirect?: Route;
}) {
  const { session } = await getCurrentSession();

  if (!session) {
    throw new Error("No session found");
  }

  const is = (await session.user?.role) === args?.role;

  if (is) {
    return {
      success: true,
      user: session?.user,
    };
  }

  redirect(args?.redirect || pathsConfig.auth.signIn);
}
