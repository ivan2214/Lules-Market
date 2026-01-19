import "server-only";

import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentSession } from "./get-current-session";

export const requireSession = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect(pathsConfig.auth.signIn);
  }
};
