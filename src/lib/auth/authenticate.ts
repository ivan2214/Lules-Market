"use server";

import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentSession } from "@/data/session/get-current-session";
import { auth } from ".";
import type { Permissions, Role } from "./roles";

export async function authenticate(args?: {
  permissions?: Permissions;
  role?: Role;
  redirect?: Route;
}) {
  const { session } = await getCurrentSession();

  if (!session) {
    throw new Error("No session found");
  }

  if (!args?.permissions) {
    const user = session?.user;
    const userRole = user?.role?.split(",");

    if (!args?.role || userRole?.includes(args?.role)) {
      return {
        success: true,
        user,
      };
    }
    redirect(args?.redirect || pathsConfig.auth.signIn);
  }

  const is = await auth.api.userHasPermission({
    body: {
      permissions: args?.permissions,
    },
    headers: await headers(),
  });
  if (is.success) {
    return {
      success: true,
      user: session?.user,
    };
  }
  redirect(args?.redirect || pathsConfig.auth.signIn);
}
