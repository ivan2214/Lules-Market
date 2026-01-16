"use server";

import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentSession } from "./get-current-session";

export const requireSession = async () => {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return redirect(pathsConfig.auth.signIn);
    }
  } catch (error) {
    console.log(error);
    throw new Error("UNAUTHORIZED");
  }
};
