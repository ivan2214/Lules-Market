"use server";

import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getSession } from "@/orpc/actions/user/get-session";
import { auth } from ".";
import type { Permissions, Role } from "./roles";

export async function authenticate(args?: {
  permissions?: Permissions;
  role?: Role;
  redirect?: Route;
}) {
  const [error, data] = await getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!args?.permissions) {
    const user = data?.user;
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
      user: data?.user,
    };
  }
  redirect(args?.redirect || pathsConfig.auth.signIn);
}
